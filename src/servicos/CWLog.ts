import * as util from "util";
import appConfig from "@raiz/app-config";

import * as AWS from 'aws-sdk';
import { InputLogEvent, Tags } from "aws-sdk/clients/cloudwatchlogs";

const DEBUG = appConfig.DEBUG;

export enum CWLogTipo {
    INFO  = "INFO",
    DEBUG = "DEBUG",
    ERRO  = "ERRO"
}
/**
 * CloudWatch Log padrão/geral da aplicação.
 * 
 * Os registros são enviados via CloudWatch API (HTTP).
 * Recomendado utilizar apenas para registro de erros importantes ou debug.
 */
export default class CWLog
{
    private cw: AWS.CloudWatchLogs;
    private setup = false;
    
    constructor() 
    {
        this.cw = new AWS.CloudWatchLogs({
            region: appConfig.CWLog.regiao, 
            maxRetries: 2, 
            httpOptions: {timeout: 1*1000, connectTimeout: 1*1000}
        });
    }

    public async log(msg: any, tipo: CWLogTipo)
    {
        await this._setup();
        await this._log(msg, tipo);
    }

    public async info(msg: any)
    {
        await this._setup();
        await this._log(msg, CWLogTipo.INFO);
    }

    public async debug(msg: any)
    {
        await this._setup();
        await this._log(msg, CWLogTipo.DEBUG);
    }

    public async erro(msg: any)
    {
        await this._setup();
        await this._log(msg, CWLogTipo.ERRO);
    }

    private async _setup()
    {
        if(this.setup) return true;
        this.setup = true;

        try
        {
            await this.cw.createLogGroup({
				logGroupName: appConfig.CWLog.nome,
				tags: {
					"Descricao": appConfig.CWLog.descricao
				} as Tags
            }).promise();

            await this.cw.putRetentionPolicy({
                logGroupName: appConfig.CWLog.nome,
                retentionInDays: 90
            }).promise();

            await this.cw.createLogStream({
                logGroupName: appConfig.CWLog.nome,
                logStreamName: CWLogTipo.INFO
            }).promise();

            await this.cw.createLogStream({
                logGroupName: appConfig.CWLog.nome,
                logStreamName: CWLogTipo.DEBUG
            }).promise();

            await this.cw.createLogStream({
                logGroupName: appConfig.CWLog.nome,
                logStreamName: CWLogTipo.ERRO
            }).promise();
        }
        catch(e)
        {
            // DEBUG && console.error(">>> CWLogs._setup()")
            // DEBUG && console.error(e);
            // DEBUG && console.error(">>>");

            return false;
        }

        return true;
    }

    private async _log(msg: string, tipo: CWLogTipo)
    {
        if(!appConfig.CWLog.ativo)
        {
            return;
        }
        
		const evento = {
			timestamp: new Date().getTime(),
			message: this._inspect(msg)
        } as InputLogEvent;
        
		let resPut = null;
		
		try
		{
			const resDesc = await this.cw.describeLogStreams({
                logGroupName: appConfig.CWLog.nome,
                logStreamNamePrefix: tipo
			}).promise();

			const strSeqToken = resDesc.logStreams?.length ? resDesc.logStreams[0].uploadSequenceToken : "";

			resPut = await this.cw.putLogEvents({
				logGroupName: appConfig.CWLog.nome,
				logStreamName: tipo,
				logEvents: [evento],
				sequenceToken: strSeqToken
            }).promise();
		}
		catch(e) 
		{
			if(resPut && resPut.nextSequenceToken)
			{
				try {
					resPut = await this.cw.putLogEvents({
						logGroupName: appConfig.CWLog.nome,
						logStreamName: tipo,
						logEvents: [evento],
						sequenceToken: resPut.nextSequenceToken
					}).promise();
				}
				catch(e2){ console.error("erro no putLogEvents_2(): ", e2); throw(e2) };
			}

			console.error("erro no putLogEvents(): ",  JSON.stringify(e));
			// throw(e);
		}
    }

    private _inspect(msg: any) : string
    {
        return util.inspect(msg, true, 4, false);
    }
}