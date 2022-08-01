import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from './hook/theme';
import { FocusKeyStoreProvider } from './hook/store'

import Home from './pages/Home';
import Collection from './pages/Collection'
import Video from './pages/Video';
import Player from './pages/Player';
// import 'react-native/tvos-types.d'

// declare const global: {HermesInternal: null | {}};

const Stack = createNativeStackNavigator();

const App = () => {
  const { statusBarColor, statusBarStyle } = useTheme();

  const backgroundStyle = {
    backgroundColor: statusBarColor,
  };

  const screenOptions = {
    headerShown: false,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={statusBarStyle} />
      <View style={{
        height: '100%'
      }}>
        <FocusKeyStoreProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="home">
              <Stack.Screen name="home" component={Home} options={screenOptions} />
              <Stack.Screen name="collection" component={Collection} options={screenOptions} />
              <Stack.Screen name="video" component={Video} options={screenOptions} />
              <Stack.Screen name="player" component={Player} options={screenOptions} />
            </Stack.Navigator>
          </NavigationContainer>
        </FocusKeyStoreProvider>
      </View>
    </SafeAreaView>
  );
};

export default App;
