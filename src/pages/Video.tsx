import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableHighlight, Text } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import VideoPlayer from '../components/VideoPlayer';
import { useFocusStoreKey } from '../hook/store'
import BackgroundView from '../components/BackgroudView';

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

    const [activeEpisode, setActiveEpisode] = useState(0)

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
    const playingUrl = useMemo<string>(() => {
        if (isEpisode) {
            const video = videoInfo as Episode;
            return getM3u8Uri(video.url_template!, video.m3u8_list[activeEpisode])
        }
        else {
            return (videoInfo as Film).m3u8_url
        }
    }, [activeEpisode])

    const setFullscreen = () => {
        let episodes = null;
        let playing = 0;
        if (isEpisode) {
            const video = videoInfo as Episode;
            episodes = video.m3u8_list.map(m3u8 => getM3u8Uri(video.url_template!, m3u8))
            playing = activeEpisode;
        }

        navigation.navigate({
            name: 'player' as never,
            params: { url: playingUrl, playing, episodes } as never
        })
        setStoreFocus(activeEpisode)
    }

    useEffect(() => {
        if (isFocused) {
            setFocused(storeFocus)
        }
        else {
            setFocused(-1)
        }
    }, [isFocused])

    useEffect(() => {
        return () => {
            setStoreFocus(0)
        }
    }, [])

    return (
        <BackgroundView>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={{
                    padding: 10,
                    flexDirection: 'row'
                }}>
                    <View style={{
                        width: 500,
                        height: 300,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <VideoPlayer url={playingUrl} />
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text style={{ fontSize: 20, color: '#fff' }}>{videoInfo.title}</Text>
                        <View style={{
                            marginTop: 10
                        }}>
                            <Text style={{ color: '#fff' }}>????????????</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <View style={{
                        padding: 10
                    }}>
                        <Text style={{ color: '#fff' }}>??????</Text>
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
                                                <EpisodeItem
                                                    key={index}
                                                    hasTVPreferredFocus={index === focused}
                                                    // active={isActiveVideo(m3u8)}
                                                    onFocus={
                                                        () => setActiveEpisode(index)
                                                    }
                                                    onPress={setFullscreen}>{`???${index + 1}???`}</EpisodeItem>
                                            )
                                        )
                                    }
                                </View>
                            </ScrollView>
                        ) : (
                            <View style={{
                                padding: 10
                            }}>
                                <EpisodeItem hasTVPreferredFocus active onPress={setFullscreen}>??????</EpisodeItem>
                            </View>
                        )
                    }
                </View>
            </View>
        </BackgroundView>
    )
}

function EpisodeItem({ hasTVPreferredFocus = false, onFocus, onPress, children }: {
    hasTVPreferredFocus?: boolean;
    active?: boolean;
    onFocus?: () => void;
    onPress?: () => void;
    children: string;
}) {
    return (
        <View style={{
            width: '12.5%',
            padding: 5
        }}>
            <TouchableHighlight
                underlayColor="rgba(0, 255, 255, .3)"
                hasTVPreferredFocus={hasTVPreferredFocus}
                style={{
                    borderWidth: 2,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: '#fff'
                }} onFocus={onFocus} onPress={onPress}>
                <Text style={{ color: '#fff' }}>{children}</Text>
            </TouchableHighlight>
        </View>
    )
}

export default Video;
