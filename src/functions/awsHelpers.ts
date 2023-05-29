import ProxyAgent from 'keepalive-proxy-agent';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { config } from '../config';


export function createConstructorOptions(
    keepConnectionAlive = false,
    option?: Partial<ServiceConfigurationOptions>,
): Partial<ServiceConfigurationOptions> {
    return {
        maxRetries: 2,
        sslEnabled: true,
        httpOptions: createHttpOtps(keepConnectionAlive),
        region: config.AWS_REGION,
        ...option,
    }
}

function createHttpOtps(keepConnectionAlive: boolean) {
    return {
        connectTimeout: 1000,
        agent: new ProxyAgent({ keepAlive: keepConnectionAlive }),
    }
}
