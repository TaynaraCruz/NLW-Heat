import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { styles } from './styles';
import { Message, MessageProps } from '../Message';
import { api } from '../../services/api';
import { io } from 'socket.io-client';

let messagesQueue: MessageProps[] = [];

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', newMessage => {
  messagesQueue.push(newMessage);

});
export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<MessageProps[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const messageResponse = await api.get<MessageProps[]>('/messages/last3');
      setCurrentMessages(messageResponse.data)
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages(prevState => [messagesQueue[0], prevState[0], prevState[1]]);
        messagesQueue.shift();//remove o primeiro elemento
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      /**
       * keyboardShouldPersistTaps prop da scrollview: 
       * toda vez que alguem clicar na lista o teclado fecha sozinho
       */

      keyboardShouldPersistTaps='never'
    >
      {currentMessages.map(msg => <Message key={msg.id} data={msg} />)}
    </ScrollView>
  );
}