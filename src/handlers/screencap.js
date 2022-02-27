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

    await docClient.put({
        TableName: tableName,
        Item: {
            UserId: event.requestContext.authorizer.claims.sub,
            Date: `${screencapStates.PENDING}#${new Date().toISOString()}`,
            Website: website
        }
    }).promise();

    return {
        statusCode: 202,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Success"
    };
}
