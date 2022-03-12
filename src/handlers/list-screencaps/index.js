const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js')
const entities = require('/opt/entities.js')

const tableName = process.env.TABLE_NAME;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
    console.info('Event =>', event, event.queryStringParameters);

    const status = event.queryStringParameters?.status;

    if (!['pending', 'completed', 'bookmarks'].includes(status)) {
        throw Error(`Invalid status attribute: ${status}`)
    }

    const requestingPending = event.queryStringParameters?.status === 'pending';
    const hasCursor = Boolean(event.queryStringParameters?.cursor);

    const data = await docClient.query({
        TableName: tableName,
        KeyConditionExpression: `PK = :id${status !== 'bookmarks' ? ' and begins_with(SK, :status)' : ''}`,
        IndexName: status === 'bookmarks' ? 'BookmarksGSI' : undefined,
        ExpressionAttributeValues: {
            ":id": `USER#${event.requestContext.authorizer.claims.sub}`,
            ...(status !== 'bookmarks' ? {
                ":status": `SCREENCAP#${requestingPending ? screencapStates.PENDING: screencapStates.COMPLETED}`
            }: {})
        },
        ScanIndexForward: false,
        ExclusiveStartKey: hasCursor ? JSON.parse(Buffer.from(event.queryStringParameters.cursor, 'base64').toString()) : undefined,
        
        Limit: requestingPending ? 13: 7 // item count + 1 (metadata record)
    }).promise();

    console.info('Data =>', data);

    // Count is first item only when not using cursor because metadata item is the first item and with cursor it will be skipped
    const response = {
        items: [
            ...(hasCursor ? data.Items : data.Items.slice(1))
        ].map(item => new entities.Screencap(item)),
        count: hasCursor ? undefined : data.Items[0].Count,
        cursor: data.LastEvaluatedKey ? Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64') : undefined
    }

    console.info('Response =>', response);

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(response)
    };
}
