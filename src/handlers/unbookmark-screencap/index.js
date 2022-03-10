const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js')

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
    console.info('Event =>', event, event.pathParameters?.SK);

    if (!event.pathParameters.SK.includes(screencapStates.COMPLETED)) {
        throw new Error("Can't unbookmark non completed screenshot");
    }

    await docClient.update({
        TableName: tableName,
        Key: {
            PK: `USER#${event.requestContext.authorizer.claims.sub}`,
            SK: decodeURIComponent(event.pathParameters.SK)
        },
        UpdateExpression: 'REMOVE BookmarkedAt',
    }).promise();

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Success"
    };
}
