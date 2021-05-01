import React, { useState } from 'react';
import { auth, database, provider } from '../Firebase.js';

const WritePlaylist = props => {
    const [title, setTitle] = useState("");
    const userId = auth.currentUser.uid;
    const tracks = props.tracks;

    const writeToFire = e => {
        e.preventDefault();
        console.log(e.target.title.value);
        console.log(tracks[0])
        // database.ref('/playlists_' + userId).set({
        //     title: title
        // })

        for (var i=0; i<tracks.length; i++){
            let songId = tracks[i].id
            let artist = tracks[i].artists[0].name;
            let song = tracks[i].name;
            let album = tracks[i].album.name;

            // console.log(artist, song, album)

            database.ref('/user_' + userId + '/' + title + '/song_' + songId).set({
                artist: artist,
                song: song,
                album: album,
            })

        }
    }

    function readFromFire() {
        let playlists = []
        database.ref('/user_' + userId).once('value', (snapshot) => {
            snapshot.forEach((snap) => {
                let playlistName = snap.key;
                let playlistSongs = snap.val();
                let playlist = {
                    name: playlistName,
                    songs: playlistSongs
                }
                playlists.push(playlist);
            });
        });

        console.log(playlists);
    }

    return (
        <div>
            <form onSubmit={e => writeToFire(e)} >
                <input 
                type='text' 
                name='title' 
                placeholder='Playlist Title' 
                value={title}
                onChange={e => setTitle(e.target.value)}
                />
                <input type='submit' value='Save Playlist'/>
            </form>
            <button onClick={readFromFire}>Read Playlists</button>
        </div>
    )
}

export default WritePlaylist;