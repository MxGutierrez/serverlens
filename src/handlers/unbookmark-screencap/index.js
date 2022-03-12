const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js')

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
    console.info('Event =>', event, event.pathParameters?.SK);

    await docClient.transactWrite({
        TransactItems: [{
            Update: {
                TableName: tableName,
                Key: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK: Buffer.from(event.pathParameters.id, 'base64').toString()
                },
                UpdateExpression: 'REMOVE BookmarkedAt',
                ConditionExpression: 'contains(SK, :completed)',
                ExpressionAttributeValues: {
                    ':completed': screencapStates.COMPLETED
                }
            },
        }, {
            Update: {
                TableName: tableName,
                Key: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK: `SCREENCAP#BOOKMARK#METADATA`,
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
