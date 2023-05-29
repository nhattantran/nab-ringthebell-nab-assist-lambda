import { DynamoDB } from 'aws-sdk'
import { createConstructorOptions } from '../awsHelpers'


export const dynamodb =  new DynamoDB.DocumentClient(createConstructorOptions(true));