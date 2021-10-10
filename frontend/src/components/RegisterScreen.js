import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";

export default function Register() {

  return (
    <View style={styles.container}>
      <Text>Register</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
