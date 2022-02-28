
const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    console.info('received:', event, event.pathParameters?.date);

    await docClient.delete({
        TableName: tableName,
        Key: {
            UserId: event.requestContext.authorizer.claims.sub,
            Date: decodeURIComponent(event.pathParameters.date)
        }
    }).promise();

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: "Success"
    };
}
