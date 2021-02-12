import appConfig from "@raiz/app-config";
import Redis from "./Redis";

const DEBUG = appConfig.DEBUG;

export default async function GetServerSideAPI<RetornoTipo>(chave: string, fnGetRemote: Promise<RetornoTipo>)
{
    try 
    {
        let retorno: RetornoTipo|null = null; // retorno
        
        const red = new Redis();
        const key = chave;

        try 
        {
            await red.conectar();
            let strCache: string | null = null;

            if (red.ativo) 
            {
                strCache = await red.getKey(key);

                if (strCache && typeof strCache === "string" && strCache.trim() != "") 
                {
                    DEBUG && console.log("> cache :: existe");
                    retorno = JSON.parse(strCache);
                    return retorno;
                }
            }
        }
        catch (e) 
        {
            DEBUG && console.log("cache > Falha ao conectar redis: " + e);
        }
        
        DEBUG && console.log("> cache :: nao existe! buscando dados...");
        retorno = await fnGetRemote;

        try 
        {
            if (red.ativo) 
            {
                DEBUG && console.log("> cache :: salvando");

                await red.setKey(key, JSON.stringify(retorno));

            }
        }
        catch (e) 
        {
            DEBUG && console.log("> cache :: Erro ao salvar no redis: " + key);
            DEBUG && console.log(e);
        }

        return retorno;
    }
    catch (e) 
    {
        console.log(chave + " :: Erro: " + e);
    }
}