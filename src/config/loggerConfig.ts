import pino from "pino";

export const loggerConfig = {
    level: "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
        },
    },
    serializers: {
        err: pino.stdSerializers.err,
        req(req: any) {
            const { method, url, headers, remoteAddress } = req;

            return {
                id: req.id,
                method,
                url,
                remoteAddress,
                headers: {
                    "host": headers["host"],
                    "user-agent": headers["user-agent"],
                    "content-type": headers["content-type"],
                },
            };
        },
        res(res: any) {
            const {statusCode, headers} = res;

            return {
                statusCode,
                headers: {
                    'request-id': headers['request-id'],
                    'content-type': headers['content-type']
                }
            };
        },
    }
}

export const pinoLogger = pino(loggerConfig);

export default loggerConfig;
