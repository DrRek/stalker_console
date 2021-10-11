import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";
import ApiContext from '../contexts/ApiContext'

export default function UserInfo({navigation}) {
  const { signOut } = React.useContext(ApiContext);

  return (
    <View style={styles.container}>
      <Text>userInfo</Text>
      <Button
        title="Logout"
        onPress={signOut}
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
