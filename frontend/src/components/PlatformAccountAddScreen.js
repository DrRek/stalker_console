import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker'

export default function NewPlatformAccountScreen({navigation}) {
  const [platforms, setPlatforms] = React.useState([])
  const [platformId, setPlatformId] = React.useState(null)
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const api = React.useContext(ApiContext);

  useEffect(() => {
    async function fetchPlatforms() {
      const received_platforms = await api.fetchPlatforms();
      setPlatforms(received_platforms);
    }

    fetchPlatforms();
  }, [])

  return (
    <View style={styles.container}>
      <Text>Add here the information of the account you own</Text>
      <Picker
        selectedValue={platformId}
        style={{ height: 50, width: 150 }}
        onValueChange={(platformValue, itemIndex) => setPlatformId(platformValue)}
      >
        {
          platforms && platforms.map(({_id, name}) => (
            <Picker.Item label={name} value={_id} key={_id}/>
          ))
        }
      </Picker>
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
        title="Add Account"
        onPress={async () => {
          await api.addPlatformAccount(username, password, platformId)
          navigation.goBack()
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
