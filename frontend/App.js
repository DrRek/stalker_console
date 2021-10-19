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
import BackgroundService from './src/components/BackgroundService';
import JobAddScreen from './src/components/JobAddScreen';
import deviceStorage from './src/services/storage.service';
import ApiContext from './src/contexts/ApiContext';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Config from 'react-native-config';

const axios = require('axios');

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

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

  const apiContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        console.log(Config.HOSTNAME);
        try {
          const response = await axios({
            method: 'post',
            url: `${Config.HOSTNAME}/api/auth/signin`,
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
          console.log(e.response);
        }
      },
      signOut: () => {
        deviceStorage.removeItem('user');
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async (username, email, password) => {
        const newUserRequest = {
          username: username,
          email: email,
          password: password,
        };
        try {
          console.log(newUserRequest);
          const response = await axios({
            method: 'post',
            url: `${Config.HOSTNAME}/api/auth/signup`,
            headers: {},
            data: newUserRequest,
          });
          console.log(response.data);
        } catch (e) {
          console.log('Error while registering');
          console.log(e);
        }
      },
      fetchPlatforms: async () => {
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/platform/all`,
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      fetchJobsTypes: async platformAccountId => {
        console.log(platformAccountId);
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/jobs_types/all`,
            params: {
              platformAccountId: platformAccountId,
            },
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
            url: `${Config.HOSTNAME}/api/platform_account/add`,
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
      delPlatformAccount: async platformAccountId => {
        try {
          const response = await axios({
            method: 'post',
            url: `${Config.HOSTNAME}/api/platform_account/del`,
            headers: await get_auth_headers(),
            data: {
              platformAccountId
            },
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      addJob: async (platformAccountId, jobType, targetUser) => {
        try {
          const response = await axios({
            method: 'post',
            url: `${Config.HOSTNAME}/api/job/add`,
            headers: await get_auth_headers(),
            data: {
              platformAccountId,
              jobType,
              targetUser,
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
            url: `${Config.HOSTNAME}/api/platform_account/all`,
            headers: await get_auth_headers(),
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      getJob: async platformAccountId => {
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/job/all`,
            headers: await get_auth_headers(),
            params: {
              platformAccountId,
            },
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      runJob: async (platformAccountId, jobId) => {
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/job/run`,
            headers: await get_auth_headers(),
            params: {
              platformAccountId,
              jobId,
            },
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      runPendingJobs: async () => {
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/job/run/all`,
            headers: await get_auth_headers(),
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
      searchPlatformAccountUsers: async (platformAccountId, userSearch) => {
        try {
          const response = await axios({
            method: 'get',
            url: `${Config.HOSTNAME}/api/platform_account/users/search`,
            headers: await get_auth_headers(),
            params: {
              platformAccountId,
              userSearch,
            },
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
            url: `${Config.HOSTNAME}/api/test`,
            headers: await get_auth_headers(),
          });
          return response.data;
        } catch (e) {
          console.log(e);
        }
      },
    }),
    [],
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
    BackgroundService.Start(apiContext);
  }, []);

  return (
    <ApiContext.Provider value={apiContext}>
      <NavigationContainer>
        {!state.user ? (
          <Tab.Navigator>
            <Tab.Screen name="Login" component={LoginScreen} />
            <Tab.Screen name="Register" component={RegisterScreen} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="provaasd"
              options={{headerShown: false}}
              children={() => (
                <Drawer.Navigator>
                  <Stack.Screen name="Stalker Console" component={MainScreen} />
                  <Drawer.Screen name="Account" component={UserInfoScreen} />
                </Drawer.Navigator>
              )}
            />
            <Stack.Screen
              name="PlatformAccountTab"
              component={PlatformAccountTab}
            />
            <Stack.Screen
              name="NewPlatformAccount"
              component={PlatformAccountAddScreen}
            />
            <Stack.Screen name="NewJob" component={JobAddScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </ApiContext.Provider>
  );
}

function PlatformAccountTab({route, navigation}) {
  const {platformAccountId} = route.params;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="PlatformAccountJobs"
        children={() => (
          <PlatformAccountJobsScreen
            platformAccountId={platformAccountId}
            navigation={navigation}
          />
        )}
      />
      <Tab.Screen
        name="PlatformAccountActivy"
        children={() => (
          <PlatformAccountActivityScreen
            platformAccountId={platformAccountId}
            navigation={navigation}
          />
        )}
      />
    </Tab.Navigator>
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
