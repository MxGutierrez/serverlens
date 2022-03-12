// I could also make a direct mapping between api gateway and dynamodb and remove this lambda:
// Using Velocity Mapping Templates you can change the normal POST parameters into the arguments that DynamoDB requires for the PUT action. This is great for simple logic where the Lambda would have just transformed the request before doing the DynamoDB command
// https://www.jeffersonfrank.com/insights/aws-lambda-design-considerations

const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js');

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    console.info('event:', event);

    const website = JSON.parse(event.body)?.website;

    if (!website) {
        throw new Error("Body doesn't have website attribute");
    }

    await docClient.transactWrite({
        TransactItems: [{
            Put: {
                TableName: tableName,
                Item: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK: `SCREENCAP#${screencapStates.PENDING}#${new Date().toISOString()}`,
                    Website: website
                }
            },
        }, {
            Update: {
                TableName: tableName,
                Key: {
                    PK: `USER#${event.requestContext.authorizer.claims.sub}`,
                    SK: `SCREENCAP#${screencapStates.PENDING}#METADATA`,
                },
                UpdateExpression: 'SET #count = #count + :incr',
                ExpressionAttributeNames: {
                    '#count': 'Count'
                },
                ExpressionAttributeValues: {
                    ':incr': 1
                }
            }
        }]
    }).promise()

    return {
        statusCode: 202,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Success"
    };
}
