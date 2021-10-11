import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button, TextInput } from "react-native";
import ApiContext from "../contexts/ApiContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { signIn } = React.useContext(ApiContext);
  return (   
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <TextInput
        style={styles.input}
        onChangeText={setUsername}
        value={username}
        placeholder="Username or Email"
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
      />
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
      />
      <Button
        title="Login"
        onPress={() => {
          signIn(username, password)
        }}
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
});
