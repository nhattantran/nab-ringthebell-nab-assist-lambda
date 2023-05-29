import winston from 'winston';
import winstonCloudWatch from 'winston-aws-cloudwatch';

export const logger = winston.createLogger({
    level: 'info',
    transports: []
});

logger.add(new winstonCloudWatch({
    logGroupName: '/aws/lambda/nab-ringthebell-function',
    logStreamName: 'test',
    createLogStream: true,
    awsConfig: {
            accessKeyId: '',
            secretAccessKey: '',
            region: 'ap-southeast-2'
    }
}))