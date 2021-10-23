import axios from 'axios';

export const api = axios.create({
  //ip do computador acessível com o comando ifconfig do terminal
  baseURL: 'http://192.168.0.104:4000'
});