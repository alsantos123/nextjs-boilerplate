import AWS from "aws-sdk";

const AWS_KEY = process.env.AWS_IAM_KEY    || "";
const AWS_SEC = process.env.AWS_IAM_SECRET || "";

if(AWS_KEY !== "")
{
    const cred = new AWS.Credentials(AWS_KEY, AWS_SEC);
    AWS.config.credentials = cred;
}
else
{
    const cred = new AWS.SharedIniFileCredentials();
    AWS.config.credentials = cred;
}

export {AWS};

export default {
    DEBUG: true,
    
    AWS: 
    {
        regiao: process.env.AWS_REGION,
        iam: {
            key: process.env.AWS_IAM_KEY,
            secret: process.env.AWS_IAM_SECRET
        }
    },

    HTTP: 
    {
        timeout: 5 * 1000, // 30s
        cwlog: false, // Use apenas para debug!!! Nunca em prod!!! Registra todos os erros HTTP no CloudWatchLogGroup da aplicação.
    },

    CWLog:
    {
        ativo: true, 
        regiao: process.env.AWS_REGION,

        nome: "/nextjs-api/log",
        descricao: "Log do app",
    },

    Redis: 
    {
        ativo: true,
        host: "127.0.0.1",
        ttl: 60 * 60 * 1 // 1 hora (seconds)
    },
}