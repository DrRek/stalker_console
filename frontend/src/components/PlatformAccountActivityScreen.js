import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";
import ApiContext from '../contexts/ApiContext'

export default function PlatformAccountActivityScreen({navigation, platformAccountId}) {
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
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
