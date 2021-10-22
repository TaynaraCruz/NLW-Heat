import React from 'react';
import { ScrollView } from 'react-native';
import { styles } from './styles';

import { Message } from '../Message';

export function MessageList() {

  const message = {
    id: '1',
    text: 'Mensagem de teste',
    user: {
      name: 'Rodrigo',
      avatar_url: 'https://randomuser.me/api/portraits/men/91.jpg',
    }
  }
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
      <Message data={message} />
      <Message data={message} />
      <Message data={message} />
    </ScrollView>
  );
}