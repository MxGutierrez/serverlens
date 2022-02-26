const chromium = require('chrome-aws-lambda');
const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');

let browser;
let page;
const s3 = new AWS.S3();

const bucketName = process.env.BUCKET_NAME;
const tableName = process.env.TABLE_NAME;

const docClient = new dynamodb.DocumentClient({
    endpoint: process.env.AWS_SAM_LOCAL
        ? 'http://dynamodb:8000'
        : undefined
});

exports.handler = async (event) => {
    const website = JSON.parse(event.body)?.website;

    if (!website) {
        throw new Error("Body doesn't have website attribute");
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
    
    if (!page) {
        console.info('Starting new page');
        page = await browser.newPage();
    }

    console.info(`Moving to website: ${website}`);
    await page.goto(website)

    console.info('Screenshotting website');
    const screencap = await page.screenshot();

    if (!screencap) {
        throw new Error(`Error generating screencap for website: ${website}`);
    }

    console.info(`Screenshot successful, saving to bucket: ${process.env.BUCKET_NAME}`);

    const filename = `${uuid.v4()}.png`;

    await s3.putObject({
        Bucket: bucketName,
        Key: filename,
        Body: screencap,
    }).promise();

    console.info(`Screenshot saved as: ${filename}`);

    console.info(`Saving screenshot item to db table: ${tableName}`);

    console.log(await docClient.put({
        TableName: tableName,
        Item: {
            id: uuid.v4(),
            path: filename
        }
    }).promise());

    console.info('Saved screenshot item to db');

    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*'
        },
        body: 'Success'
    };
}