import { createContext, ReactNode, useState } from "react"
import { useEffect } from 'react'
import { api } from '../services/api'

type AuthResponse = {
  token: string,
  user: {
    id: string,
    avatar_url: string,
    name: string,
    login: string,
  }
}

type User = {
  id: string,
  name: string,
  login: string,
  avatar_url: string,
}

type AuthContextData = {
  user: User | null;
  signInUrl: string,
  signOut: () => void,
}

export const AuthContext = createContext({} as AuthContextData)

/**
 * ReactNode: é qualquer coisa aceitável pelo react
 * textos, componentes, elementos html, números, etc.
 */
type AuthProvider = {
  children: ReactNode,
}
/**
 * Propriedades são passadas de componente a outro em react via argumento
 */
export function AuthProvider(props: AuthProvider) {

  const [user, setUser] = useState<User | null>(null)
  const signInUrl = `http://github.com/login/oauth/authorize?scope=user&client_id=be739ca005d7e98ad785`

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    })

    const { token, user } = response.data;
    localStorage.setItem('@dowhile:token', token)
    api.defaults.headers.common.authorization = `Bearer ${token}`
    setUser(user)
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`
      api.get<User>('profile').then(res => {
        setUser(res.data)
      })
    }
  }, [])
  useEffect(() => {
    const url = window.location.href
    const hasGitHubCode = url.includes('?code=')
    if (hasGitHubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=')
      /**Remove o código da url para que o usuário jamais veja!!
       * A função pushState do objeto History do javascript serve para mudar a 
       * url do browser sem dar Refresh. E essa é a sua sintaxe:
       * window.history.pushState(data, title [, url ] )
       * Mais info: 
       * https://pt.stackoverflow.com/questions/246455/pra-que-server-a-fun%C3%A7%C3%A3o-history-pushstate
      */
      window.history.pushState({}, '', urlWithoutCode)
      signIn(githubCode)
    }
  }, [])
  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }} >
      {props.children}
    </AuthContext.Provider>
  )
}