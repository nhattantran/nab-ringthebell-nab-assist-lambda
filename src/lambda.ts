import { Context, Handler, KinesisStreamEvent, KinesisStreamRecordPayload, S3CreateEvent } from "aws-lambda";
import atobLib from 'atob';
import { ContactLensResponse } from "./types/ContactLens";
import { processConctactLensResponse } from "./processor/contactLensService";
import { logger } from "./utils/logger";
import { getObject } from "./core/s3.service";

export const handler: Handler = async (event: S3CreateEvent, context: Context) => {
    logger.info('Lambda event payload:', event);
    const records = await Promise.all(event.Records.map(async (record) => {
      return getObject(record.s3.bucket.name, record.s3.object.key);
    }));
    // TODO: handle records
    if (!isKinesisEvent(event)) return;
    await Promise.all(event.Records.map(async (e) => await processKinesisData(e.kinesis)));
}

function isKinesisEvent(event: any): event is KinesisStreamEvent {
    return (
        Boolean(event.Records?.length) &&
        event.Records[0].hasOwnProperty('kinesis')
    );
}

async function processKinesisData(eventPayload: KinesisStreamRecordPayload) {
    try {
        const decodedData = atobLib(eventPayload.data);
        const prettyData = decodedData.replace('\\', '');
        console.log('Kinesis data:', prettyData);
        const contactLensResponse: ContactLensResponse = JSON.parse(decodedData);
        await processConctactLensResponse(contactLensResponse);
    } catch (err) {
        console.log('Process failed', err as any)
    }
}
