import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { styles } from './styles';
import { Button } from '../Button';
import { COLORS } from '../../theme';

export function SendMessageForm() {
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        keyboardAppearance="dark"
        placeholder="Qual a sua expectativa para o evento"
        placeholderTextColor={COLORS.GRAY_PRIMARY}
        style={styles.input}
        multiline
        maxLength={140}
        onChangeText={setMessage}
        value={message}
        editable={!sendingMessage}
      />
      <Button
        title="ENVIAR MENSAGEM"
        backgroundColor={COLORS.PINK}
        color={COLORS.WHITE}
      />

    </View>
  );
}