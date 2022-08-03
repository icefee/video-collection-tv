import React, { useState, useEffect, useRef } from 'react';
import { View, Text, useTVEventHandler, type HWEvent, TouchableWithoutFeedback, Image } from 'react-native';
import Video, { type ProcessParams, type PlayerRef, type VideoInfo } from 'react-native-video';
import LoadingIndicator from './LoadingIndicator';
import { FadeView } from './Animated'

interface VideoPlayerProps {
    url: string;
    keysEnable?: boolean;
}

function timeFormatter(sf: number): string {
    const s = Math.round(sf)
    const [m, h] = [60, 60 * 60]
    return [...(s < h ? [] : [Math.floor(s / h)]), Math.floor((s < h ? s : s % h) / m), s % m].map(
        v => String(v).padStart(2, '0')
    ).join(':')
}

function VideoPlayer({ url, keysEnable = false }: VideoPlayerProps) {

    const [loading, setLoading] = useState(false);
    const playerRef = useRef<PlayerRef>()

    const timeoutRef = useRef<unknown>()

    const [paused, setPaused] = useState(false)
    const [seeking, setSeeking] = useState(false)

    const [totalDuration, setTotalDuration] = useState(0)

    const [keyType, setKeyType] = useState('none')

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
        setKeyType(event.eventType)
        if (keysEnable) {
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
                setSeeking(true)
            }
            else if (event.eventType === 'select' || event.eventType === 'playPause' || event.eventType === 'center') {
                setPaused(paused => !paused)
            }
        }
    };

    useTVEventHandler(tvEventHandler);

    const onLoad = ({ duration }: VideoInfo) => {
        setTotalDuration(duration)
    }

    const onSeek = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current as number)
        }
        timeoutRef.current = setTimeout(() => {
            setSeeking(false)
        }, 5000);
    }

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
                onReadyForDisplay={() => setLoading(false)}
                onProgress={onProgress}
                /* @ts-ignore */
                ref={ref => playerRef.current = ref}
                onLoad={onLoad}
                paused={paused}
                onSeek={onSeek}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />
            <FadeView style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, .3)',
            }} in={paused}>
                <TouchableWithoutFeedback hasTVPreferredFocus onPress={() => setPaused(paused => !paused)}>
                    <Image
                        source={require('../assets/pause.png')}
                        style={{
                            width: 100,
                            resizeMode: 'contain'
                        }}
                    />
                </TouchableWithoutFeedback>
            </FadeView>
            <FadeView in={paused || seeking} style={{
                position: 'absolute',
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, .3)'
            }}>
                <Text style={{ color: '#fff' }}>{timeFormatter(process.currentTime)}</Text>
                <View style={{
                    flex: 1,
                    height: 4,
                    backgroundColor: '#777',
                    marginHorizontal: 10,
                    position: 'relative'
                }}>
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        width: process.playableDuration * 100 / totalDuration + '%',
                        backgroundColor: '#ccc',
                        height: '100%'
                    }} />
                    <View style={{
                        position: 'absolute',
                        left: 0,
                        width: process.currentTime * 100 / totalDuration + '%',
                        backgroundColor: 'cyan',
                        height: '100%'
                    }} />
                </View>
                <Text style={{ color: '#fff' }}>{timeFormatter(totalDuration)}</Text>
            </FadeView>
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
            <View style={{
                position: 'absolute',
                right: 20,
                top: 20
            }}>
                <Text style={{
                    color: '#fff',
                    fontSize: 18
                }}>keyType: {keyType}</Text>
            </View>
        </View>
    )
}

export default VideoPlayer;