import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import ApiContext from '../contexts/ApiContext';
import deviceStorage from '../services/storage.service';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';
import {Text, Button} from 'react-native-elements';

const axios = require('axios');

export default function UserInfo({navigation}) {
  const {signOut, runPendingJobs } = React.useContext(ApiContext);
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const retrieveUser = async () => {
      setUser(JSON.parse(await deviceStorage.getItem('user')));
    };
    retrieveUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Avatar
            rounded
            source={require('../../resources/img/user-avatar.png')}
            size={150}
          />
        </View>
        <View style={styles.userTextContainer}>
          <Text h2 style={{color: '#86939e'}}>
            Hi,
          </Text>
          <Text h2 style={{color: '#2089dc', textTransform: 'capitalize'}}>
            {user && user.username}
          </Text>
        </View>
      </View>
      <Button
        title="Run all jobs"
        icon={{name: 'directions-run', color: 'white'}}
        onPress={runPendingJobs}
        buttonStyle={styles.button}
      />
      <Button
        title="Logout"
        icon={{name: 'logout', color: 'white'}}
        onPress={signOut}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#86939e',
    width: '100%',
  },
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 200,
    justifyContent: 'space-evenly',
  },
  userTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    minWidth: 300,
    height: 50,
    margin: 20,
  },
});
