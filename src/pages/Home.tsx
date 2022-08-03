import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableHighlight, ImageBackground } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useFocusStoreKey } from '../hook/store';
import LoadingIndicator from '../components/LoadingIndicator'
import BackgBackgroudView from '../components/BackgroudView'

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
            setFocused(-1)
        }
    }, [isFocused])

    const commonStyle = {
        flex: 1,
        backgroundColor: 'transparent'
    }

    return (
        <BackgBackgroudView>
            {
                loading ? (
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
                                            onFocus={index => setStoreFocus(index)}
                                            section={section}
                                        />
                                    )
                                )
                            }
                        </View>
                    </ScrollView>
                )
            }
        </BackgBackgroudView>
    )
}

function VideoSection({ index, autoFocus, section, onFocus }: { index: number, autoFocus: number, onFocus: (index: number) => void, section: Section }) {

    const navigation = useNavigation();

    return (
        <View style={{
            width: '25%',
            padding: 10
        }}><TouchableHighlight underlayColor="cyan" hasTVPreferredFocus={autoFocus === index} onFocus={() => onFocus(index)} onPress={
            () => navigation.navigate({
                name: 'collection' as never,
                params: section as never
            })
        }>
                <View style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                    borderWidth: 4,
                    borderColor: '#fff',
                    height: 180
                }}>
                    <ImageBackground resizeMode="cover" source={require('../assets/cover.jpeg')} style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end'
                    }}>
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
            </TouchableHighlight>
        </View>
    )
}

export default Home;
