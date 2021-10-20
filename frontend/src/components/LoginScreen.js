import React, { useRef, useState } from "react";
import { StyleSheet, View, Button } from "react-native";
import {Input, Icon} from 'react-native-elements';
import ApiContext from "../contexts/ApiContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { signIn } = React.useContext(ApiContext);

  const submitPressed = () => {
    signIn(username, password)
  }

  const passwordRef = useRef();
  return (   
    <View style={styles.container}>
      <Input
        label="Insert here the username"
        placeholder="Username or Email"
        leftIcon={<Icon name="person" size={24} color="black" />}
        onChangeText={setUsername}
        autoCapitalize='none'
        autoCorrect={false}
        autoCompleteType='email'
        blurOnSubmit={false}
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
        title="Login"
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
