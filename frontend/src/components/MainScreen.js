import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button, FlatList } from "react-native";

export default function Main({navigation}) {
  const [platformAccounts, setPlatformAccounts] = useState([])
  const api = React.useContext(ApiContext);

  useEffect(() => {
    const retrievePlatformAccounts = async () => {
      setPlatformAccounts(await api.getPlatformAccount())
    }
    retrievePlatformAccounts()
  }, [])
  console.log(platformAccounts)

  return (
    <View style={styles.container}>
      <Text>Main</Text>
      <FlatList
        data={platformAccounts}
        renderItem={({item:{_id, platform, username}}) => <Text>{platform} {username}</Text>}
      />
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
    backgroundColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
