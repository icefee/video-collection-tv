import React, { useState, useEffect, useRef } from 'react';
import { View, Text, useTVEventHandler, type HWEvent, TouchableWithoutFeedback, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Video, { type ProcessParams, type PlayerRef, type VideoInfo } from 'react-native-video';
import LoadingIndicator from './LoadingIndicator';
import { FadeView } from './Animated';
import { useBitSize } from '../hook/byteSize';

interface VideoPlayerProps {
    url: string;
    onEnd?: () => void;
    keysEnable?: boolean;
}

function timeFormatter(sf: number): string {
    const s = Math.round(sf)
    const [m, h] = [60, 60 * 60]
    return [...(s < h ? [] : [Math.floor(s / h)]), Math.floor((s < h ? s : s % h) / m), s % m].map(
        v => String(v).padStart(2, '0')
    ).join(':')
}

function VideoPlayer({ url, onEnd, keysEnable = false }: VideoPlayerProps) {

    const [loading, setLoading] = useState(false);
    const playerRef = useRef<PlayerRef>()

    const timeoutRef = useRef<number>()
    const [overlayShow, setOverlayShow] = useState(false)

    const [paused, setPaused] = useState(false)
    const [seeking, setSeeking] = useState(false)

    const [bitSize, setBitrate] = useBitSize(0)

    const [totalDuration, setTotalDuration] = useState(0)

    const isFocused = useIsFocused();

    const [process, setProcess] = useState<ProcessParams>({
        currentTime: 0,
        playableDuration: 0,
        seekableDuration: 0
    });

    const onProgress = (params: ProcessParams) => {
        if (!seeking) {
            setProcess(params)
        }
    }

    useEffect(() => {
        setPaused(!isFocused)
    }, [isFocused])

    const tvEventHandler = (event: HWEvent) => {
        if (keysEnable) {
            if (event.eventType === 'left' || event.eventType === 'right') {
                const nextDuration = Math.max(
                    0,
                    Math.min(
                        event.eventType === 'left' ? process.currentTime - 15 : process.currentTime + 15,
                        process.seekableDuration
                    )
                );
                playerRef.current?.seek(nextDuration);
                setProcess(params => ({
                    ...params,
                    currentTime: nextDuration
                }))
                setOverlayShow(true);
                setSeeking(true)
            }
            // else if (event.eventType === 'select') {
            //     setPaused(paused => !paused)
            // }
        }
    };

    useTVEventHandler(tvEventHandler);

    const onLoad = ({ duration }: VideoInfo) => {
        setTotalDuration(duration)
    }

    const onSeek = () => {
        clearControlDismissTimeout()
        createControlTimeout()
    }

    const createControlTimeout = () => {
        /* @ts-ignore */
        timeoutRef.current = setTimeout(() => setOverlayShow(false), 3000)
    }
    const clearControlDismissTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = undefined;
        }
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
                onBuffer={({ isBuffering }) => setLoading(isBuffering)}
                reportBandwidth
                onBandwidthUpdate={
                    ({ bitrate }) => setBitrate(bitrate)
                }
                onProgress={onProgress}
                /* @ts-ignore */
                ref={ref => playerRef.current = ref}
                onLoad={onLoad}
                paused={paused}
                onPlaybackStateChanged={
                    ({ isPlaying }) => {
                        if (isPlaying) {
                            createControlTimeout()
                        }
                        else {
                            clearControlDismissTimeout()
                        }
                    }
                }
                minLoadRetryCount={100}
                onEnd={onEnd}
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
                <TouchableWithoutFeedback hasTVPreferredFocus onPress={() => setPaused(!paused)}>
                    <Image
                        source={require('../assets/pause.png')}
                        style={{
                            width: 75,
                            resizeMode: 'contain'
                        }}
                    />
                </TouchableWithoutFeedback>
            </FadeView>
            <FadeView in={paused || overlayShow} style={{
                position: 'absolute',
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                bottom: 10,
                backgroundColor: 'rgba(0, 0, 0, .3)'
            }}>
                <Text style={{ color: '#fff', fontSize: 20 }}>{timeFormatter(process.currentTime)}</Text>
                <View style={{
                    flex: 1,
                    height: 8,
                    overflow: 'hidden',
                    borderRadius: 4,
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
                <Text style={{ color: '#fff', fontSize: 20 }}>{timeFormatter(totalDuration)}</Text>
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
                right: 10,
                top: 10
            }}>
                <Text style={{ color: '#fff', fontSize: 12 }}>{bitSize}</Text>
            </View>
        </View>
    )
}

export default VideoPlayer;