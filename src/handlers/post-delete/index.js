const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME;

exports.handler = async (event) => {
    console.info('Event =>', event);

    for (const record of event.Records) {
        console.info('Record =>', record)

        const path = record.dynamodb.OldImage.Path.S;

        console.info('Deleting object in path: ', path);
        
        try {
            await s3.deleteObject({
                Bucket: bucketName,
                Key: path,
            }).promise();

        } catch (ex) {
            console.info('Failure deleting object =>', ex);

            return {
                batchItemFailures: [{
                    itemIdentifier: record.dynamodb.SequenceNumber
                }]
            };
        }
    }

    return {
        batchItemFailures: []
    }
};