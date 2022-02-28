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
    console.info('received:', event, event.queryStringParameters);

    const data = await docClient.query({
        TableName: tableName,
        KeyConditionExpression: 'UserId = :id and begins_with(#date, :status)',
        ProjectionExpression: '#date, #path, Website',
        ExpressionAttributeValues: {
            ":id": event.requestContext.authorizer.claims.sub,
            ":status": event.queryStringParameters?.status === 'Pending' ? screencapStates.PENDING: screencapStates.COMPLETED
        },
        ExpressionAttributeNames: {
            "#date": "Date",
            "#path": "Path"
        },
        ScanIndexForward: false,
        ExclusiveStartKey: event.queryStringParameters?.cursor ? JSON.parse(event.queryStringParameters.cursor) : undefined,
        Limit: 6
    }).promise();


    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    };
}
