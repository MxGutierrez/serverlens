const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.TABLE_NAME;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#transactWrite-property
const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    console.info('received:', event);

    const data = await docClient.query({
        TableName: tableName,
        KeyConditionExpression: 'UserId = :id',
        ExpressionAttributeValues: {
            ":id": event.requestContext.authorizer.claims.sub
        },
        ProjectionExpression: '#date, #path, Website',
        ExpressionAttributeNames: {
            "#date": "Date",
            "#path": "Path"
        }
    }).promise();

    console.log('data retrieved', data, data?.Items);

    const screencaps = data.Items;

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(screencaps)
    };
}
