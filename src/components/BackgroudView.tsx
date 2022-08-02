import React from 'react';
import { ImageBackground } from 'react-native';

export default function BackgroundView({ children }: { children: React.ReactChild }) {
    return (
        <ImageBackground resizeMode="cover" source={require('../assets/background.jpg')} style={{ flex: 1 }} blurRadius={20}>
            {children}
        </ImageBackground>
    )
}
