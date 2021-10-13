import 'react-native-gesture-handler';
import React, {useRef, useState, useEffect} from 'react';
import {
  AppState,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import MainScreen from './src/components/MainScreen';
import UserInfoScreen from './src/components/UserInfoScreen';
import PlatformAccountAddScreen from './src/components/PlatformAccountAddScreen';
import PlatformAccountJobsScreen from './src/components/PlatformAccountJobsScreen';
import PlatformAccountActivityScreen from './src/components/PlatformAccountActivityScreen';
import deviceStorage from './src/services/storage.service';
import ApiContext from './src/contexts/ApiContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

const axios = require('axios');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const HOSTNAME = 'http://192.168.1.86:8090';

const get_auth_headers = async () => {
  const user = JSON.parse(await deviceStorage.getItem('user'));
  if (user && user.accessToken) {
    return {'x-access-token': user.accessToken};
  } else {
    return {};
  }
};

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            user: action.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            user: action.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            user: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      user: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let user;
      try {
        user = JSON.parse(await deviceStorage.getItem('user'));
      } catch (e) {
        // Restoring token failed
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', user: user});
    };
    bootstrapAsync();
  }, []);

  const apiContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        try {
          const response = await axios({
            method: 'post',
            url: 'http://192.168.1.86:8090/api/auth/signin',
            headers: {},
            data: {
              username,
              password,
            },
          });
          deviceStorage.saveItem('user', JSON.stringify(response.data));
          dispatch({type: 'SIGN_IN', user: response.data});

          console.log(response.data);
        } catch (e) {
          console.log('Error while logging in');
          console.log(e);
          console.log(e.response)
        }
      },
      signOut: () => {
        deviceStorage.removeItem('user');
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (username, email, password) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore`
        // In the example, we'll use a dummy token
        const newUserRequest = {
          username: username,
          email: email,
          password: password,
        };
        try {
          console.log(newUserRequest);
          const response = await axios({
            method: 'post',
            url: 'http://192.168.1.86:8090/api/auth/signup',
            headers: {},
            data: newUserRequest,
          });
          console.log(response.data);
        } catch (e) {
          console.log('Error while registering');
          console.log(e);
        }
        //deviceStorage.saveItem("user", JSON.stringify({"name": "luca"}))
        //dispatch({ type: 'SIGN_IN', user: {"name": "luca"} });
      },
      fetchPlatforms: async () => {
        try {
          const response = await axios({
            method: 'get',
            url: `${HOSTNAME}/api/platform/all`,
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      addPlatformAccount: async (username, password, platformId) => {
        try {
          const response = await axios({
            method: 'post',
            url: `${HOSTNAME}/api/platform_account/add`,
            headers: await get_auth_headers(),
            data: {
              username,
              password,
              platformId,
            },
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      getPlatformAccount: async () => {
        try {
          const response = await axios({
            method: 'get',
            url: `${HOSTNAME}/api/platform_account/all`,
            headers: await get_auth_headers(),
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      test: async () => {
        try {
          const response = await axios({
            method: 'get',
            url: `${HOSTNAME}/api/test`,
            headers: await get_auth_headers(),
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      }
    }),
    [],
  );

  return (
    <ApiContext.Provider value={apiContext}>
      <NavigationContainer>
        {!state.user ? (
          <Tab.Navigator>
            <Tab.Screen name="Login" component={LoginScreen} />
            <Tab.Screen name="Register" component={RegisterScreen} />
          </Tab.Navigator>
        ) : (
          <Drawer.Navigator>
            <Drawer.Screen name="HomeStack" component={HomeStack} />
            <Drawer.Screen name="Account" component={UserInfoScreen} />
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </ApiContext.Provider>
  );
}

function PlatformAccountTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PlatformAccountJobs"
        component={PlatformAccountJobsScreen}
      />
      <Tab.Screen
        name="PlatformAccountActivy"
        component={PlatformAccountActivityScreen}
      />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Tab.Screen name="Main" component={MainScreen} />
      <Tab.Screen
        name="NewPlatformAccount"
        component={PlatformAccountAddScreen}
      />
      <Tab.Screen name="PlatformAccountTab" component={PlatformAccountTab} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
