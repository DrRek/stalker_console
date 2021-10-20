import React, {useRef, useState, useEffect} from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Input, Icon, Button} from 'react-native-elements';
import {Dropdown} from 'react-native-material-dropdown-v2-fixed';

export default function NewPlatformAccountScreen({navigation}) {
  const [platforms, setPlatforms] = React.useState([]);
  const [selectedPlatform, setSelectedPlatform] = React.useState(null);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const api = React.useContext(ApiContext);

  useEffect(() => {
    async function fetchPlatforms() {
      const received_platforms = await api.fetchPlatforms();
      setPlatforms(received_platforms);
    }

    fetchPlatforms();
  }, []);

  const usernameRef = React.createRef();
  const passwordRef = React.createRef();
  const addPlatforAccount = async () => {
    await api.addPlatformAccount(username, password, selectedPlatform._id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Add here the information of the account you own</Text>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Select the platform</Text>
        <View style={styles.dropdownBottomContainer}>
          <Icon name="person" size={24} color="black"/>
          <Picker
            label="Platform"
            onValueChange={(itemValue, itemIndex) => {
              setSelectedPlatform(itemValue)
              usernameRef.current.focus()
            }}
            style={styles.inputDropdown}
            mode="dropdown"
            dropdownIconColor="#86939e"
          >
            {
              platforms && platforms.map(item => (
                <Picker.Item key={item._id} label={item.name} value={item} />
              ))
            }
          </Picker>
        </View>
      </View>
      <Input
        label="Insert here the account username"
        placeholder="Username or Email"
        leftIcon={<Icon name="person" size={24} color="black" />}
        style={styles.input}
        onChangeText={setUsername}
        blurOnSubmit={false}
        ref={usernameRef}
        onSubmitEditing={() => passwordRef.current.focus()}
      />
      <Input
        label="Insert here the account password"
        placeholder="Password"
        leftIcon={<Icon name="person" size={24} color="black" />}
        style={styles.input}
        onChangeText={setPassword}
        secureTextEntry={true}
        ref={passwordRef}
        onSubmitEditing={addPlatforAccount}
      />
      <Button
        title="Add Account"
        onPress={addPlatforAccount}
        icon={<Icon name="add" size={15} color="white" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  dropdownContainer: {
    flex: 1,
    color: 'black',
    width: '95%',
    borderBottomWidth: 1,
    borderBottomColor: '#86939e',
    marginBottom: 25,
    maxHeight: 75
  },
  dropdownBottomContainer:{
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    flexWrap: 'wrap',
    height: 100,
  },
  dropdownLabel: {
    fontWeight: 'bold',
    color: '#86939e',
    fontFamily: 'sans-serif',
    fontSize: 16,
  },
  inputDropdown: {
    flex:1,
    color: 'black',
    placeholderTextColor: '#86939e',
    fontSize: 18,
    minHeight: 40,
  },
  input: {},
});
