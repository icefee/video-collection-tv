import React, { type FunctionComponent, useMemo, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native'
import VideoPlayer from '../components/VideoPlayer';

type PlayerProps = {
    url: string;
    playing: number;
    episodes: string[] | null;
}

const Player: FunctionComponent = () => {

    const route = useRoute()
    const navigation = useNavigation()

    const video = useMemo<PlayerProps | null>(
        () => route.params as PlayerProps,
        [route]
    )

    const [activeEpisode, setActiveEpisode] = useState(video ? video.playing : 0)

    const playingUrl = useMemo<string | null>(() => {
        if (video) {
            if (video.episodes) {
                return video.episodes[activeEpisode]
            }
            return video.url
        }
        return null;
    }, [video, activeEpisode])

    const onEnd = () => {
        if (video) {
            if (video.episodes && activeEpisode < video.episodes.length - 1) {
                setActiveEpisode(activeEpisode + 1)
            }
            else {
                navigation.goBack()
            }
        }
    }

    return playingUrl ? (
        <VideoPlayer keysEnable onEnd={onEnd} url={playingUrl} />
    ) : null
}

export default Player;
