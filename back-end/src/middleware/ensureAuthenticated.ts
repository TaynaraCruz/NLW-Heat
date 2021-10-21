import { Request, Response, NextFunction, response } from 'express';
import { verify } from 'jsonwebtoken';


interface IPayload {
  sub: string
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      errorCode: 'token.invalid',
    });
  }
  /**[, token] ignora a primeira posição do split e salva a segunda em token
   * o authToken é uma string que vem assim: Bearer 858f5f5f4d8ikf2f2333f
   * [0] Bearer
   * [1] 858f5f5f4d8ikf2f2333f
   * logo token = 858f5f5f4d8ikf2f2333f
   * */
  const [, token] = authToken.split(' ')

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload
    req.user_id = sub

    return next()

  } catch (err) {
    return res.status(401).json({ errorCode: 'token.expired' });
  }
}