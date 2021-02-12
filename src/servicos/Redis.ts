import redis from "redis";
import appConfig from '@raiz/app-config';

export default class Redis
{
    private ttl = appConfig.Redis.ttl;
    private client : redis.RedisClient|null = null;
    public ativo = false;

    constructor(){}
    
    public conectar()
    {
        return new Promise((done, erro) => 
        {
            if(!appConfig.Redis.ativo) 
            {
                erro("Redis desativado no AppConfig");
                return;
            }

            this.client = redis.createClient({host: appConfig.Redis.host});

            this.client.on("connect", () => {
                this.ativo = true;
                done(true);
            });

            this.client.on("error", (e) => {
                erro(e);
            });

        });
    }

    public setKey(chave: string, valor: string)
    {
        return new Promise((done: (bln:boolean) => void, erro) => 
        {
            if(!this.ativo) erro("Redis não conectado");
    
            this.client?.set(chave, valor, (err: any) => 
            {
                if(err) erro(err);

                this.client?.expire(chave, this.ttl, (err) => {
                    if(err) console.log("erro no expire " + chave + " => " + err);
                    done(true);
                });
            });

        });

    }

    public getKey(chave: string)
    {
        return new Promise((done: (valor: string|null) => void, erro) => 
        {
            if(!this.ativo) erro("Redis não conectado");
    
            this.client?.get(chave, (err: any, valor: string|null) => 
            {
                if(err) erro(err);
                done(valor);
            });
        });
    }
}