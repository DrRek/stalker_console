import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";
import ApiContext from '../contexts/ApiContext'

export default function PlatformAccountActivityScreen({navigation, route}) {
  console.log(route)
  const { platformAccountId } = route

  return (
    <View style={styles.container}>
      <Text>PlatformAccountActivityScreen</Text>
      <Text>{platformAccountId}</Text>
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
