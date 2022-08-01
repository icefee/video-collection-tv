import React, { useState, useEffect, useRef } from 'react';
import { View, useTVEventHandler, type HWEvent } from 'react-native';
import Video, { type ProcessParams, type PlayerRef } from 'react-native-video';
import LoadingIndicator from './LoadingIndicator';

interface VideoPlayerProps {
    url: string;
    duration?: number;
}

function VideoPlayer({ url }: VideoPlayerProps) {

    const [loading, setLoading] = useState(false);
    const playerRef = useRef<PlayerRef>()
    const [process, setProcess] = useState<ProcessParams>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0
    });

    useEffect(() => {
        setLoading(true);
    }, [url])

    const onProgress = (params: ProcessParams) => {
        setProcess(params)
    }

    const tvEventHandler = (event: HWEvent) => {
        if (event.eventType === 'left' || event.eventType === 'right') {
            playerRef.current?.seek(
                Math.max(
                    0,
                    Math.min(
                        event.eventType === 'left' ? process.currentTime - 15 : process.currentTime + 15,
                        process.seekableDuration
                    )
                )
            );
        }
    };

    useTVEventHandler(tvEventHandler);

    return (
        <View style={{
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        }}>
            <Video
                source={{ uri: url }}
                controls={!loading}
                onReadyForDisplay={() => setLoading(false)}
                onProgress={onProgress}
                /* @ts-ignore */
                ref={ref => playerRef.current = ref}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            {
                loading && (
                    <View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <LoadingIndicator />
                    </View>
                )
            }
        </View>
    )
}

export default VideoPlayer;