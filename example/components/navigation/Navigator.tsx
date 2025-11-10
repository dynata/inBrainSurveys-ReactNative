import React from 'react';
import Home from './Home';
import NativeSurveys from './NativeSurveys';
import NativeOffers from './NativeOffers';

import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  NativeSurveys: undefined;
  NativeOffers: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  const baseOptions = () => {
    return {
      headerTitle: '',
      headerBackVisible: false,
      headerShown: false,
    };
  };

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0a0c27',
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen name="Home" component={Home} options={baseOptions} />
        <Stack.Screen
          name="NativeSurveys"
          component={NativeSurveys}
          options={{
            headerTitle: 'Native Surveys',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="NativeOffers"
          component={NativeOffers}
          options={{
            headerTitle: 'Native Offers',
            headerBackVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
