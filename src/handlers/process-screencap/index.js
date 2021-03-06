const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');
const screencapStates = require('/opt/screencap-states.js')

let browser;

const s3 = new AWS.S3();

const bucketName = process.env.BUCKET_NAME;
const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient();

exports.handler = async (event) => {
    console.info('event: ', event);

    for (const record of event.Records) {
        console.info('Processing record: ', record);
        try {
            const website = record.dynamodb.NewImage?.Website?.S;

            if (!website || !/^www\.[a-zA-Z-._]{2,256}\.[a-z]{2,6}$/.test(website)) {
                throw new Error(`Invalid website attribute: ${website}`);
            }

            if (!browser) {
                console.info('Starting browser');
                browser = await chromium.puppeteer.launch({
                    args: chromium.args,
                    defaultViewport: chromium.defaultViewport,
                    executablePath: await chromium.executablePath,
                    headless: true,
                    ignoreHTTPSErrors: true,
                });
            }
            
            console.info('Starting new page');
            const page = await browser.newPage();

            console.info(`Moving to website: ${website}`);
            await page.goto(`http://${website}`);

            console.info('Screenshotting website');
            const screencap = await page.screenshot();

            await page.close();

            if (!screencap) {
                throw new Error(`Error generating screencap for website: ${website}`);
            }

            console.info(`Screenshot successful, saving to bucket: ${process.env.BUCKET_NAME}`);

            const filename = `${record.dynamodb.Keys.PK.S.split('#')[1]}/${uuid.v4()}.png`;

            await s3.putObject({
                Bucket: bucketName,
                Key: filename,
                Body: screencap,
                ContentDisposition: `attachment; filename=${website.split('.')[1]}.png`
            }).promise();

            console.info(`Screenshot saved as: ${filename}`);

            console.info(`Saving screenshot item to db table: ${tableName}`);

            // Remove old item and create new one in completed step. The item is not updated because the data
            // that identifies the screencap state is in the SK and apparently PKs can't be updated
            // https://stackoverflow.com/questions/55474664/dynamoddb-how-to-update-sort-key
            await docClient.transactWrite({
                TransactItems: [{
                    Delete: {
                        TableName: tableName,
                        Key: {
                            PK: record.dynamodb.Keys.PK.S,
                            SK: record.dynamodb.Keys.SK.S
                        },
                        ConditionExpression: 'begins_with(SK, :pending)', // Only execute transaction when item is in pending state
                        ExpressionAttributeValues: {
                            ':pending': `SCREENCAP#${screencapStates.PENDING}#`
                        }
                    }
                }, {
                    Put: {
                        TableName: tableName,
                        Item: {
                            PK: record.dynamodb.Keys.PK.S,
                            SK: `SCREENCAP#${screencapStates.COMPLETED}#${new Date().toISOString()}`,
                            RequestedDate: record.dynamodb.Keys.SK.S.split('#')[2],
                            Path: filename,
                            Website: website
                        }
                    }
                }, {
                    Update: {
                        TableName: tableName,
                        Key: {
                            PK: record.dynamodb.Keys.PK.S,
                            SK: `SCREENCAP#COMPLETED#METADATA`,
                        },
                        UpdateExpression: 'SET #count = #count + :incr',
                        ExpressionAttributeNames: {
                            '#count': 'Count'
                        },
                        ExpressionAttributeValues: {
                            ':incr': 1
                        }
                    }
                }, {
                    Update: {
                        TableName: tableName,
                        Key: {
                            PK: record.dynamodb.Keys.PK.S,
                            SK: `SCREENCAP#PENDING#METADATA`,
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
            }).promise();

            console.info('Saved screenshot item to db');

        } catch (ex) {
            try {
                await docClient.update({
                    TableName: tableName,
                    Key: {
                        PK: record.dynamodb.Keys.PK.S,
                        SK: record.dynamodb.Keys.SK.S
                    },
                    UpdateExpression: 'set FailureReason = :reason',
                    ExpressionAttributeValues: {
                        ':reason': ex.message,
                    }
                }).promise();

            } finally {

                console.info('Failure: ', ex);

                return {
                    batchItemFailures: [{
                        itemIdentifier: record.dynamodb.SequenceNumber
                    }]
                };
            }
        }
    }

    return {
        batchItemFailures: []
    }
}