// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as util from "util";
import type { NextApiRequest, NextApiResponse } from 'next'
// import AWS from 'aws-sdk';

import GetServerSideAPI from '@raiz/src/servicos/GetServerSideAPI';
import PokemonAPI, { IPokemonAPI_Ret } from '@raiz/src/servicos/API/PokemonAPI'
import appConfig, {AWS} from "@raiz/app-config";
import CWLog from "@raiz/src/servicos/CWLog";

function inspect(msg:any)
{
    return util.inspect(msg, false, 2, false);
}

export default async (req: NextApiRequest, res: NextApiResponse<any>) => 
{
    const poke = new PokemonAPI();
    
    const ret = await GetServerSideAPI<IPokemonAPI_Ret>("POKE", poke.listar()) || null;
    
    // const s3  = new AWS.S3();
    // const ret = await s3.listBuckets().promise();

    const cw = new CWLog();
    await cw.info("ola mundo");

    res.status(200).json(ret);
}
