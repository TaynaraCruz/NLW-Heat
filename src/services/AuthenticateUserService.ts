/**
 * Receber code(string)
 * Recuperar o access_token no github
 * Recuperar infos do user no github
 * Verificar se o usuario existe no banco de dados
 * ---- SIM = Gera um token
 * ---- Não = Cria no DB e gera um token
 * Retornar o token com as infos do usuario logado
 */

import axios from "axios";

/**
 * Interface is a structure that defines the contract in your application. 
 * It defines the syntax for classes to follow. Classes that are derived 
 * from an interface must follow the structure provided by their interface. 
 */
interface IAccessTokenResponse {
  access_token: string
}
interface IUsernResponse {
  avatar_url: string,
  login: string,
  id: number,
  name: string
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    //Recupera o access_token no github
    /** Aqui tudo que ele retornar que estiver fora da interface 
     * IAccessTokenResponse é descartado
    */
    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        'Accept': 'application/json',
      }
    });

    //Recupera infos do user no github
    const res = await axios.get<IUsernResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      }
    });

    return res.data;
  }
}

export { AuthenticateUserService }