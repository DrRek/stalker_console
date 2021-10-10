import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";

export default function Main({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Main</Text>
      <Button 
        title="+"
        onPress={() => {
          navigation.navigate("NewPlatformAccount")
        }}
      />
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
