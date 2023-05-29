declare type LambdaResponse = ErrorResponse | any;
declare type LambdaEvent = AWSLambda.KinesisStreamEvent | AWSLambda.S3CreateEvent;
declare type ErrorResponse = { ErrorMessage: string, IsRetryable: boolean, errorId: string };

declare module 'keepalive-proxy-agent'
declare module 'winston-aws-cloudwatch'