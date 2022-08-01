import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableHighlight, Text } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import LoadingIndicator from '../components/LoadingIndicator';
import { useFocusStoreKey } from '../hook/store'

export const getM3u8Uri: (url_template: string, m3u8: M3u8Video) => string = (url_template, m3u8) => {
    if (typeof m3u8 === 'string') {
        return m3u8
    }
    else {
        return m3u8.reduce(
            (prev, current, i) => {
                return String(prev).replace(new RegExp('\\{' + i + '\\}', 'g'), String(current))
            },
            url_template
        ) as string
    }
}

function Video() {
    const route = useRoute()
    const navigation = useNavigation()

    const [focused, setFocused] = useState(0)
    const isFocused = useIsFocused();
    const [storeFocus, setStoreFocus] = useFocusStoreKey('video')

    const videoInfo = useMemo<Video>(
        () => route.params as Video,
        [route]
    )
    const isEpisode = useMemo<boolean>(
        () => 'episodes' in videoInfo,
        [videoInfo]
    )
    const [playingUrl, setPlayingUrl] = useState('')

    const setFullscreen = () => {
        navigation.navigate({
            name: 'player' as never,
            params: { url: playingUrl } as never
        })
    }

    const isActiveVideo = (m3u8: M3u8Video) => getM3u8Uri((videoInfo as Episode).url_template!, m3u8) === playingUrl;

    useEffect(() => {
        if (isFocused) {
            setFocused(storeFocus)
        }
        else {
            setStoreFocus(focused)
            setFocused(-1)
        }
    }, [isFocused])

    useEffect(() => {
        if (isEpisode) {
            const video = videoInfo as Episode;
            setPlayingUrl(
                getM3u8Uri(video.url_template!, video.m3u8_list[0])
            )
        }
        else {
            const video = videoInfo as Film;
            setPlayingUrl(video.m3u8_url)
        }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#222' }}>
            <View style={{
                padding: 10,
                flexDirection: 'row'
            }}>
                <View style={{
                    width: 300,
                    height: 200,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {playingUrl === '' ? <LoadingIndicator /> : <VideoPlayer url={playingUrl} />}
                </View>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 20, color: '#fff' }}>{videoInfo.title}</Text>
                    <View style={{
                        marginTop: 10
                    }}>
                        <Text style={{ color: '#fff' }}>暂无简介</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{
                    padding: 10
                }}>
                    <Text style={{ color: '#fff' }}>选集</Text>
                </View>
                {
                    isEpisode ? (
                        <ScrollView contentInsetAdjustmentBehavior="automatic">
                            <View style={{
                                width: '100%',
                                flexDirection: 'row',
                                flexWrap: 'wrap'
                            }}>
                                {
                                    (videoInfo as Episode).m3u8_list.map(
                                        (m3u8, index) => (
                                            <View key={index} style={{
                                                width: '12.5%',
                                                padding: 5
                                            }}>
                                                <TouchableHighlight underlayColor="rgba(0, 255, 255, .3)" hasTVPreferredFocus={index === focused} style={{
                                                    borderWidth: 2,
                                                    height: 40,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderColor: isActiveVideo(m3u8) ? 'cyan' : '#fff'
                                                }} onFocus={
                                                    () => setPlayingUrl(
                                                        getM3u8Uri((videoInfo as Episode).url_template!, m3u8)
                                                    )
                                                } onPress={setFullscreen}>
                                                    <Text style={{ color: '#fff' }}>第{index + 1}集</Text>
                                                </TouchableHighlight>
                                            </View>
                                        )
                                    )
                                }
                            </View>
                        </ScrollView>
                    ) : (
                        <View style={{
                            padding: 10
                        }}>
                            <Text>暂无</Text>
                        </View>
                    )
                }
            </View>
        </View>
    )
}

export default Video;
