import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, View, ActivityIndicator, Text, TouchableHighlight, ImageBackground, Image, TVEventHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hook/theme';

async function getVideos() {
    const url = 'https://code-space.netlify.app/flutter/videos.json'
    const response = await fetch(url)
    const json: { videos: Section[] } = await response.json()
    // const json = html.match( // /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*)<\/script\>/
    //     new RegExp('(?<=<script id="__NEXT_DATA__" type="application/json">).+?(?=</script>)', 'g')
    // )
    return json.videos;
}

function Home() {

    const [loading, setLoading] = useState(false)
    const [videoList, setVideoList] = useState<Section[]>([])
    const { backgroundColor } = useTheme()

    const getVideoList = async () => {
        setLoading(true)
        const videos = await getVideos()
        setVideoList(videos)
        setLoading(false)
    }

    useEffect(() => {
        getVideoList()
    }, [])

    return loading ? (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor,
        }}>
            <ActivityIndicator size="large" color="purple" />
        </View>
    ) : (
        <ScrollView style={{ flex: 1, backgroundColor: '#000' }} contentInsetAdjustmentBehavior="automatic">
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap'
            }}>
                {
                    videoList.map(
                        (section, index) => (
                            <VideoSection key={index} section={section} />
                        )
                    )
                }
            </View>
        </ScrollView>
    )
}

function VideoSection({ section }: { section: Section }) {

    const [isFocused, setIsFocused] = useState(false)

    return (
        <TouchableHighlight style={{
            width: '33.333333%',
        }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onPress={
            () => console.log(section.section)
        }>
            <View style={{
                padding: 10
            }}>
                <View style={{
                    borderRadius: 15,
                    overflow: 'hidden',
                    borderWidth: 8,
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
                {/* <ScrollView style={{
                paddingHorizontal: 10
            }} contentInsetAdjustmentBehavior="automatic">
                {
                    section.series.map(
                        (video, index) => (
                            <VideoCollection key={index} video={video} />
                        )
                    )
                }
            </ScrollView> */}
            </View>
        </TouchableHighlight>
    )
}

function VideoCollection({ video }: { video: Video }) {
    const navigation = useNavigation();
    const { textColor, borderColor } = useTheme();
    return (
        <Pressable onPress={() => navigation.navigate({
            name: 'video' as never,
            params: video as never
        })}>
            <View style={{
                paddingVertical: 10,
                paddingHorizontal: 5,
                borderTopWidth: 1,
                borderTopColor: borderColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: textColor }}>{video.title}</Text>
                    {'episodes' in video && <Text style={{ color: '#999' }}>{video.episodes}集</Text>}
                </View>
                <View>
                    <Image style={{
                        resizeMode: 'center',
                        width: 24,
                        height: 24
                    }} source={require('../assets/arrow-right.png')} />
                </View>
            </View>
        </Pressable>
    )
}

export default Home;
