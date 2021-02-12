import axios, {AxiosError} from "axios";
import AppConfig from "@raiz/app-config";
import CWLog from "./CWLog";

const AXIOS_TIMEOUT = AppConfig.HTTP.timeout;
const CWLOG_ATIVO   = AppConfig.HTTP.cwlog;

export default class HTTP
{
    constructor() {}

    protected async httpGet(url: string, headers: any = {}, data?: any)
    {
        try
        {
            return await axios.get(url, {
                timeout: AXIOS_TIMEOUT,
                headers: headers,
                data: data
            });
        }
        catch(e)
        {
            throw await this._httpError(e);
            // return this._httpError(e);
        }
    }

    protected async httpPost(url: string, payload: string|null = null, headers: any = {})
    {
        // const headers = { "Content-Type": "application/x-www-form-urlencoded" }
        try
        {
            return await axios.post(url, payload, {
                headers:  headers,
                timeout: AXIOS_TIMEOUT ,
            });
        }
        catch(e)
        {
            throw await this._httpError(e);
        }
    }

    protected async _log(msg: any)
    {
        console.error(msg);
        
        if(CWLOG_ATIVO)
        {
            const l = new CWLog();
            await l.erro(msg)
        }
    }

    protected async _httpError(httpError: AxiosError) 
    {
        await this._log(">>> API._httpError(axiosError)");
        await this._log(httpError.message);

        await this._log(">>> Response status e data:");
        await this._log(httpError.response?.status);
        await this._log(httpError.response?.data);

        await this._log(">>> Request url, headers e data:");
        await this._log(httpError.config.url);
        await this._log(httpError.config.headers);
        await this._log(httpError.config.data);

        return httpError.message;
    }
}