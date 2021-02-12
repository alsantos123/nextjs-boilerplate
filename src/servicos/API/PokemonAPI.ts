import HTTP from "../HTTP"

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

export default class PokemonAPI extends HTTP
{
    public async listar()
    {
        return (await this.httpGet(API_URL)).data as IPokemonAPI_Ret;
    }
}

export interface IPokemon {
    name: string;
    url: string;
}

export interface IPokemonAPI_Ret {
    count: number;
    next: string;
    previous?: any;
    results: IPokemon[];
}

