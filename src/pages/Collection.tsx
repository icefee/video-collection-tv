import React, { useState, useMemo, useEffect } from 'react';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { ScrollView, View, Text, TouchableHighlight, ImageBackground } from 'react-native';
import { useFocusStoreKey } from '../hook/store'
import BackgroundView from '../components/BackgroudView';

function Collection() {

    const route = useRoute()

    const [focused, setFocused] = useState(0)
    const isFocused = useIsFocused();
    const [storeFocus, setStoreFocus] = useFocusStoreKey('collection')

    const collection = useMemo<Section>(
        () => route.params as Section,
        [route]
    )

    useEffect(() => {
        if (isFocused) {
            setFocused(storeFocus)
        }
        else {
            setFocused(-1)
        }
    }, [isFocused])

    useEffect(() => {
        return () => setStoreFocus(0)
    }, [])

    return (
        <BackgroundView>
            <View style={{
                width: '100%',
                backgroundColor: 'transparent',
                flex: 1
            }}>
                <View style={{
                    padding: 20
                }}>
                    <Text style={{
                        fontSize: 32,
                        color: '#fff'
                    }}>{collection.section}</Text>
                </View>
                <ScrollView style={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {
                            collection.series.map(
                                (video, index) => (
                                    <VideoCollection
                                        video={video}
                                        autoFocus={focused}
                                        onFocus={index => setStoreFocus(index)}
                                        index={index}
                                        key={index}
                                    />
                                )
                            )
                        }
                    </View>
                </ScrollView>
            </View>
        </BackgroundView>
    )
}

function VideoCollection({ video, autoFocus, index, onFocus }: { video: Video, autoFocus: number, index: number, onFocus: (index: number) => void }) {

    const navigation = useNavigation();

    return (
        <View style={{
            width: '25%',
            padding: 10
        }}>
            <TouchableHighlight underlayColor="cyan" hasTVPreferredFocus={autoFocus === index} onFocus={() => onFocus(index)} onPress={() => navigation.navigate({
                name: 'video' as never,
                params: video as never
            })}>
                <View style={{
                    borderWidth: 4,
                    borderColor: '#fff'
                }}>
                    <ImageBackground resizeMode="cover" source={require('../assets/episode.jpeg')} style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        height: 150
                    }}>
                        <View style={{
                            padding: 5,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                        }}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>{video.title}</Text>
                            {'episodes' in video && <Text style={{ color: '#aaa' }}>{video.episodes}集</Text>}
                        </View>
                    </ImageBackground>
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default Collection;
