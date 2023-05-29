import { DescribeContactRequest, GetContactAttributesRequest } from "aws-sdk/clients/connect";
import { ContactLensResponse, Segment } from "../types/ContactLens";
import { connect } from "../functions/amazonConnect/connect";
import { DynamoDB } from "aws-sdk";
import { dynamodb } from "../functions/dynamodb/client";

const instanceId: string = 'arn:aws:connect:ap-southeast-2:312734942162:instance/ba13a334-0329-4bc8-9544-a82b970effaf';

export async function processConctactLensResponse(contactLensResponse: ContactLensResponse): Promise<void> {
    if (!hasSegment(contactLensResponse)) {
        return
    }
    await Promise.all(contactLensResponse.Segments.map(async (segment) => {
        if (!hasTranscript(segment)) return;
        const content = sanitizeContent(segment.Transcript.Content.toLowerCase());
        console.log('Content:', content)
        if (content.includes('interested') && content.includes('climate change')) {
            const contactId: string = contactLensResponse.ContactId;
            const describeContactParam: DescribeContactRequest = {
                ContactId: contactId,
                InstanceId: instanceId,
            }
            const describeContactResult = await connect.describeContact(describeContactParam).promise();
            let initContactId = contactId;
            if (describeContactResult.Contact.InitialContactId) {
                initContactId = describeContactResult.Contact.InitialContactId;
            }
            const getContactAttributeParam: GetContactAttributesRequest = {
                InitialContactId: initContactId,
                InstanceId: instanceId,
            }
            const contactAttribute = await connect.getContactAttributes(getContactAttributeParam).promise();
            console.log('Contact attributes', contactAttribute);
            if (contactAttribute.Attributes.phoneNumber) {
                try {
                    const updateParam: DynamoDB.DocumentClient.UpdateItemInput = {
                        TableName: 'nab-climate-change',
                        Key: {
                            phoneNumber: contactAttribute.Attributes.phoneNumber,
                        },
                        UpdateExpression: 'SET #updatedAt = :updatedAt',
                        ExpressionAttributeNames: {
                            '#updatedAt': 'updatedAt',
                        },
                        ExpressionAttributeValues: {
                            ':updatedAt': Date.now(),
                        }
                    }
                    await dynamodb.update(updateParam).promise();
                    console.log('Update to dynamodb successfully')
                } catch (err) {
                    console.log('Error in updating dynamodb', err);
                }
            }
        }
    }))
}

function hasSegment(contactLensResponse: ContactLensResponse): boolean {
    return Boolean(contactLensResponse.Segments);
}

function hasTranscript(segment: Segment): boolean {
    return Boolean(segment.Transcript);
}

function sanitizeContent(value: string): string {
    return value.replace(/\[.,\/#!&%\^&\&\*;:{}=\\-_`~()]/g, '');
}

