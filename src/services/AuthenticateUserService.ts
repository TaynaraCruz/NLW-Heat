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
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

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
    const { login, id, avatar_url, name } = res.data;


    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      }
    });
    if (!user) {
      user = await prismaClient.user.create({
        data: {
          name,
          github_id: id,
          avatar_url,
          login,
        }
      });
    }
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        //subject: entidade à quem o token pertence
        subject: user.id,
        expiresIn: '1d'
      }
    )
    return { token, user };
  }
}

export { AuthenticateUserService }