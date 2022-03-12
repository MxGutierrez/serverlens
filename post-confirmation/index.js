const dynamodb = require('aws-sdk/clients/dynamodb');

const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient();
const screencapStates = require('/opt/screencap-states.js');

exports.handler = async (event) => {
    console.log('Event =>', event)
    if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
        return event;
    }

    await docClient.batchWrite({
        RequestItems: {
            [tableName]: [
                ...[screencapStates.PENDING, screencapStates.COMPLETED].map(status => ({
                    PutRequest: {
                        Item: {
                            PK: `USER#${event.userName}`,
                            SK: `SCREENCAP#${status}#METADATA`,
                            Count: 0
                        }
                    },
                })),
                {
                    PutRequest: {
                        Item: {
                            PK: `USER#${event.userName}`,
                            SK: `SCREENCAP#BOOKMARK#METADATA`,
                            Count: 0,
                            BookmarkedAt: 'COUNT' // Fill BookmarkedAt attribute so it's included in BookmarksGSI
                        }
                    },
                }
            ]
        }
    }).promise();

    return event;
};