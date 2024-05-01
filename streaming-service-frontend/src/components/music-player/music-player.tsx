'use client'
import React, {useEffect, useState} from 'react';
import Image from 'next/image'
import styles from './page.module.css'
const initialStatePlayingSong = {
    title: null, // Possible values: 'This is the real life', null
    songAlbumCoverImage: null, // Possible values: '/img/placeholder-album.png', null
    isPlaying: false, // Possible values: false, null
    timeElapsedMinutes: null,// Possible values: 2:35, null
    timeElapsedSeconds: null
}
const MusicPlayer: React.FC = () => {
    /**
     * TODO: pull info from currently playing song
     * This state contains the information of the currently playing song
     */
    const [playingSong, setPlayingSong] = useState(initialStatePlayingSong);
    return (
        <section className={styles.musicPlayer}>
            <Image
                src={playingSong?.songAlbumCoverImage ?? '/img/placeholder-album.png'}
                width={35}
                height={35}
                alt={playingSong?.title ?? 'Placeholder for an album coverage image'}
                className={styles.albumImg}
            />
            <time dateTime={`${playingSong?.timeElapsedMinutes ?? '00'}:${playingSong?.timeElapsedSeconds ?? '00'}`}>
                {`${playingSong?.timeElapsedMinutes ?? '00'}:${playingSong?.timeElapsedSeconds ?? '00'}`}</time>
            <menu >
                <button>
                    <Image
                        src='/icons/song-rewind-white-30.png'
                        width={30}
                        height={30}
                        alt="Rewind song icon"
                    />
                </button>
                <button onClick={(e) => {
                    setPlayingSong({...playingSong, isPlaying: !playingSong.isPlaying})
                }}>
                    <Image
                        src={playingSong?.isPlaying ? '/icons/song-pause-white-30.png' : '/icons/song-play-white-30.png'}
                        width={30}
                        height={30}
                        alt="Play song icon"
                    />
                </button>
                <button>
                    <Image
                        src='/icons/song-fast-forward-white-30.png'
                        width={30}
                        height={30}
                        alt="Fast forward song icon"
                    />
                </button>
            </menu>
        </section>
    );
};

export default MusicPlayer;