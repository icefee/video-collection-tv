import React, { useState, useMemo, useEffect } from 'react';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { ScrollView, View, Text, TouchableHighlight } from 'react-native';
import { useFocusStoreKey } from '../hook/store'

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
            setStoreFocus(focused)
            setFocused(-1)
        }
    }, [isFocused])

    return (
        <View style={{
            width: '100%',
            backgroundColor: '#000',
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
                                    onFocus={index => setFocused(index)}
                                    index={index}
                                    key={index}
                                />
                            )
                        )
                    }
                </View>
            </ScrollView>
        </View>
    )
}

function VideoCollection({ video, autoFocus, index, onFocus }: { video: Video, autoFocus: number, index: number, onFocus: (index: number) => void }) {

    const navigation = useNavigation();
    const isFocused = autoFocus === index;

    return (
        <TouchableHighlight hasTVPreferredFocus={isFocused} style={{
            width: '33.333333%'
        }} onFocus={() => onFocus(index)} onPress={() => navigation.navigate({
            name: 'video' as never,
            params: video as never
        })}>
            <View style={{
                padding: 10
            }}>
                <View style={{
                    padding: 10,
                    borderWidth: 4,
                    borderRadius: 8,
                    borderColor: isFocused ? 'cyan' : '#fff'
                }}>
                    <View>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}>{video.title}</Text>
                        {'episodes' in video && <Text style={{ color: '#999' }}>{video.episodes}集</Text>}
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}

export default Collection;
