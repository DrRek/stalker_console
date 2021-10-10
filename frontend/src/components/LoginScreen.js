import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";
import AuthContext from '../contexts/AuthContext'

export default function LoginScreen() {
  const { signIn } = React.useContext(AuthContext);
  return (   
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Login"
        onPress={() => {
          signIn("username", "password")
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
