import React, { type FunctionComponent, useMemo } from 'react';
import { useRoute } from '@react-navigation/native'
import VideoPlayer from '../components/VideoPlayer';

type PlayerProps = {
    url: string;
}

const Player: FunctionComponent = () => {

    const route = useRoute()

    const video = useMemo<PlayerProps>(
        () => route.params as PlayerProps,
        [route]
    )

    return (
        <VideoPlayer keysEnable url={video.url} />
    )
}

export default Player;
