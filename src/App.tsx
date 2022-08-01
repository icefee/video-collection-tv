import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from './hook/theme';

import Home from './pages/Home';
import Video from './pages/Video';
import 'react-native/tvos-types.d'

// declare const global: {HermesInternal: null | {}};

const Stack = createNativeStackNavigator();

const App = () => {
  const { statusBarColor, statusBarStyle, headerColor, textColor } = useTheme();

  const backgroundStyle = {
    backgroundColor: statusBarColor,
  };

  const screenHeaderStyle = {
    headerStyle: {
      backgroundColor: headerColor
    },
    headerTitleStyle: {
      color: textColor
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={statusBarStyle} />
      <View style={{
        height: '100%'
      }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="home" component={Home} options={{
              title: '视频文件夹',
              headerShown: false,
              ...screenHeaderStyle
            }} />
            <Stack.Screen name="video" component={Video} options={{
              headerShown: false,
              ...screenHeaderStyle,
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
};

export default App;