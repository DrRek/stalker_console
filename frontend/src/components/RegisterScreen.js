import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button, TextInput } from "react-native";
import ApiContext from "../contexts/ApiContext";

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
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Username"
        autoCapitalize='none'
        autoCorrect={false}
        blurOnSubmit={false}
        onSubmitEditing={() => emailRef.current.focus()}
      />
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
        ref={emailRef}
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
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
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
