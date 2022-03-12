const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    console.info('received:', event, event.pathParameters?.id);

    const SK = Buffer.from(event.pathParameters.id, 'base64').toString();

    await docClient.transactWrite({
        TransactItems: [{
            Delete: {
                TableName: tableName,
                Key: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK
                }
            },
        }, {
            Update: {
                TableName: tableName,
                Key: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK: `SCREENCAP#${SK.split('#')[1]}#METADATA`,
                },
                UpdateExpression: 'SET #count = #count - :decr',
                ExpressionAttributeNames: {
                    '#count': 'Count'
                },
                ExpressionAttributeValues: {
                    ':decr': 1
                }
            }
        }]
    }).promise()

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Success"
    };
}
