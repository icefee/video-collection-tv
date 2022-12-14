import React from 'react';
import { Animated, type StyleProp, type ViewStyle } from 'react-native';

type FadeViewProps = {
    in: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export const FadeView: React.FC<FadeViewProps> = (props) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current
    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: props.in ? 1 : 0,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }, [props.in, fadeAnim])

    return (
        <Animated.View
            style={[
                props.style,
                {
                    opacity: fadeAnim,
                }
            ]}
        >
            {props.children}
        </Animated.View>
    );
}
