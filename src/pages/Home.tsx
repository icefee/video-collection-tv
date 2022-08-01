import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Text, TouchableHighlight, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFocusStoreKey } from '../hook/store';
import LoadingIndicator from '../components/LoadingIndicator'

async function getVideos() {
    const url = 'https://code-space.netlify.app/flutter/videos.json'
    const response = await fetch(url)
    const json = await response.json()
    // const json = html.match( // /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*)<\/script\>/
    //     // new RegExp('(?<=<script id="__NEXT_DATA__" type="application/json">).+?(?=</script>)', 'g')
    //     /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*)<\/script\>/
    // )![0]
    // // { videos: Section[] }
    // const { props: { pageProps: { videos } } }: {
    //     props: {
    //         pageProps: {
    //             videos: Section[]
    //         }
    //     }
    // } = JSON.parse(json);
    // return videos;
    return json.videos;
}

function Home() {

    const [loading, setLoading] = useState(false)
    const [videoList, setVideoList] = useState<Section[]>([])
    const [focused, setFocused] = useState(0)
    const isFocused = useIsFocused();
    const [storeFocus, setStoreFocus] = useFocusStoreKey('home')

    const getVideoList = async () => {
        setLoading(true)
        const videos = await getVideos()
        setVideoList(videos)
        setLoading(false)
    }

    useEffect(() => {
        getVideoList()
    }, [])

    useEffect(() => {
        if (isFocused) {
            setFocused(storeFocus)
        }
        else {
            setStoreFocus(focused)
            setFocused(-1)
        }
    }, [isFocused])

    const commonStyle = {
        flex: 1,
        backgroundColor: '#000'
    }

    return loading ? (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            ...commonStyle
        }}>
            <LoadingIndicator />
        </View>
    ) : (
        <ScrollView style={commonStyle} contentInsetAdjustmentBehavior="automatic">
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>
                {
                    videoList.map(
                        (section, index) => (
                            <VideoSection
                                key={index}
                                index={index}
                                autoFocus={focused}
                                onFocus={index => setFocused(index)}
                                section={section}
                            />
                        )
                    )
                }
            </View>
        </ScrollView>
    )
}

function VideoSection({ index, autoFocus, section, onFocus }: { index: number, autoFocus: number, onFocus: (index: number) => void, section: Section }) {

    const navigation = useNavigation();
    const isFocused = autoFocus === index;

    return (
        <TouchableHighlight style={{
            width: '33.333333%',
        }} hasTVPreferredFocus={isFocused} onFocus={() => onFocus(index)} onPress={
            () => navigation.navigate({
                name: 'collection' as never,
                params: section as never
            })
        }>
            <View style={{
                padding: 10
            }}>
                <View style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    borderWidth: 8,
                    opacity: isFocused ? 1 : .5,
                    borderColor: isFocused ? 'cyan' : '#fff',
                    height: 200
                }}>
                    <ImageBackground resizeMode="cover" source={require('../assets/cover.jpeg')} style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }} blurRadius={5}>
                        <View style={{
                            padding: 10
                        }}>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: '#fff'
                            }}>{section.section}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default Home;
