/// <reference path="./video.d.ts" />

declare module 'react-native-video' {
    import type { ClassicComponentClass } from 'react'
    import type { StyleProp, ViewStyle } from 'react-native';

    export type ProcessParams = {
        currentTime: number;
        playableDuration: number;
        seekableDuration: number;
    }
    const _default: ClassicComponentClass<{
        source: {
            uri: string;
        };
        controls?: boolean;
        paused?: boolean;
        onReadyForDisplay?: () => void;
        onProgress?: (params: ProcessParams) => void;
        style?: StyleProp<ViewStyle>
    }>;

    export interface PlayerRef {
        presentFullscreenPlayer(): void;
        dismissFullscreenPlayer(): void;
        seek(duration: number): void;
    }

    export default _default;
}
