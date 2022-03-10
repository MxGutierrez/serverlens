const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js')

const tableName = process.env.TABLE_NAME;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html
const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    console.info('Event =>', event, event.queryStringParameters);

    const status = event.queryStringParameters?.status;

    if (!['pending', 'completed', 'bookmarks'].includes(status)) {
        throw Error(`Invalid status attribute: ${status}`)
    }

    const requestingPending = event.queryStringParameters?.status === 'pending';

    const data = await docClient.query({
        TableName: tableName,
        KeyConditionExpression: `PK = :id${status !== 'bookmarks' ? ' and begins_with(SK, :status)' : ''}`,
        ProjectionExpression: 'SK, #path, Website, FailureReason, BookmarkedAt',
        IndexName: status === 'bookmarks' ? 'Bookmarks' : undefined,
        ExpressionAttributeValues: {
            ":id": `USER#${event.requestContext.authorizer.claims.sub}`,
            ...(status !== 'bookmarks' ? {
                ":status": `SCREENCAP#${requestingPending ? screencapStates.PENDING: screencapStates.COMPLETED}`
            }: {})
        },
        ExpressionAttributeNames: {
            "#path": "Path"
        },
        ScanIndexForward: false,
        ExclusiveStartKey: event.queryStringParameters?.cursor ? JSON.parse(event.queryStringParameters.cursor) : undefined,
        Limit: requestingPending ? 12: 6
    }).promise();


    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    };
}
