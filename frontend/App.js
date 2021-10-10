import React, { useRef, useState, useEffect } from "react";
import { AppState, StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/components/LoginScreen'
import RegisterScreen from './src/components/RegisterScreen'
import MainScreen from './src/components/MainScreen'
import UserInfoScreen from './src/components/UserInfoScreen'
import deviceStorage from './src/services/storage.service'
import AuthContext from './src/contexts/AuthContext'

const Stack = createBottomTabNavigator();

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
    }, {
    isLoading: true,
    isSignout: false,
    user: null,
  }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place    
    const bootstrapAsync = async () => {
      let user;
      try {
        user = JSON.parse(await deviceStorage.getItem('user'))
      } catch (e) {
        // Restoring token failed      
      }
      // After restoring token, we may need to validate it in production apps
      // This will switch to the App screen or Auth screen and this loading      
      // screen will be unmounted and thrown away.      
      dispatch({ type: 'RESTORE_TOKEN', user: user });
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(    
    () => ({      
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed        
        // After getting token, we need to persist the token using `SecureStore`        
        // In the example, we'll use a dummy token
        deviceStorage.saveItem("user", JSON.stringify({"name": "luca"}))
        dispatch({ type: 'SIGN_IN', user: {"name": "luca"} });      
      },     
      signOut: () => dispatch({ type: 'SIGN_OUT' }),      
      signUp: async data => {        
        // In a production app, we need to send user data to server and get a token        
        // We will also need to handle errors if sign up failed        
        // After getting token, we need to persist the token using `SecureStore`        
        // In the example, we'll use a dummy token
        deviceStorage.saveItem("user", JSON.stringify({"name": "luca"}))
        dispatch({ type: 'SIGN_IN', user: {"name": "luca"} });      
      },    
    }),    
    []  
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {
            state.user ?
              <>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Account" component={UserInfoScreen} />
              </> :
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
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
