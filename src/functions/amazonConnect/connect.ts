import { Connect } from "aws-sdk";
import { config } from "../../config";

const options: Connect.ClientConfiguration = {
    apiVersion: '2017-08-08',
    region: config.AWS_REGION,
    maxRetries: 2,
    sslEnabled: true,
    httpOptions: {
        connectTimeout: 2000,
    }
}

export const connect = new Connect(options);