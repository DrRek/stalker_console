import React, { useRef, useState } from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import ApiContext from "../contexts/ApiContext";
import {Input, Icon} from 'react-native-elements';

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signUp, signIn } = React.useContext(ApiContext);

  const submitPressed = async () => {
    await signUp(username, email, password)
    signIn(username, password)
  }

  const emailRef = useRef();
  const passwordRef = useRef();
  return (
    <View style={styles.container}>
      <Input
        label="Insert here the username"
        placeholder="Username"
        leftIcon={<Icon name="person" size={24} color="black" />}
        onChangeText={setUsername}
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='username'
        blurOnSubmit={false}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <Input
        label="Insert here the email"
        placeholder="Email"
        leftIcon={<Icon name="email" size={24} color="black" />}
        onChangeText={setEmail}
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
        blurOnSubmit={false}
        ref={emailRef}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        label="Insert here the password"
        placeholder="Password"
        leftIcon={<Icon name="lock" size={24} color="black" />}
        onChangeText={setPassword}
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
        secureTextEntry={true}
        ref={passwordRef}
        blurOnSubmit={false}
        onSubmitEditing={submitPressed}
      />
      <Button
        title="Register"
        onPress={submitPressed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
