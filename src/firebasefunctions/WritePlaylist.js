import React, { useState, useEffect } from 'react';
import { auth, database, provider } from '../Firebase.js';
import * as $ from "jquery";


async function getRecsAjax(seedA, artistIds, seedT, songIds, urlEnd, token) {
    const recsResult = await $.ajax({
        url: "https://api.spotify.com/v1/recommendations?limit=30&" + seedA + artistIds + seedT + songIds + urlEnd,
        type: "GET",
        beforeSend: xhr => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: data => {
          // Checks if the data is not empty
          if(!data) {
            this.setState({
              no_data: true,
            });
            return;
          }
    
          console.log(data)
      
          // this.setState({
          //   songsforPlaylist: data.tracks,
          //   no_data: false /* We need to "reset" the boolean, in case the
          //                     user does not give F5 and has opened his Spotify. */
          // });
          // console.log(this.state.songsforPlaylist)
    
        }
    })
    console.log(recsResult);
    return(recsResult)
}

async function getRecs(token, stateTracks, stateArtists) {
    var artistIds = "";
    var seedA = ""
    for(var i = 0; i < 1; i++){
      if(stateArtists[i] !== undefined){
        seedA = "seed_artists="
        artistIds = artistIds + stateArtists[i].id;
        artistIds = artistIds + ",";
      }
    }
    if(stateArtists[1] !== undefined){
      artistIds = artistIds + stateArtists[1].id
    }
    var songIds = ""
    var seedT = ""
    for(var j = 0; j < 2; j++){
      if(stateTracks[j] !== undefined){
        seedT = "&seed_tracks="
        songIds = songIds + stateTracks[j].id
        songIds = songIds + ","
      }
    }
    if(stateTracks[2] !== undefined){
      songIds = songIds + stateTracks[2].id + "&"
    }
    // sliders are all undefined rn
      var urlEnd = ""
      // console.log(document.getElementById('loudness').value)
      // console.log(document.getElementById('danceable').value)
      // console.log(document.getElementById('instrumentalness').value)
  
  
      if(document.getElementById("loudness") !== null && document.getElementById("danceable") !== null && document.getElementById("instrumentalness") !== null && document.getElementById("valence") !== null && document.getElementById("energetic") !== null){
        var loudnessValue = (document.getElementById("loudness").value);
        var danceabiliityValue = (document.getElementById("danceable").value)/100;
        var instrumentalnessValue = (document.getElementById("instrumentalness").value)/100;
        var valenceValue = (document.getElementById("valence").value)/100;
        var energyValue = (document.getElementById("energetic").value)/100;
        console.log(loudnessValue, danceabiliityValue, instrumentalnessValue, valenceValue, energyValue)
      }
      if(loudnessValue !== undefined){
        urlEnd = urlEnd + "target_loudness=" + loudnessValue;
      }
      if(danceabiliityValue !== undefined){
        urlEnd = urlEnd + "&target_danceability=" + danceabiliityValue;
      }
      if(instrumentalnessValue !== undefined){
        urlEnd = urlEnd + "&target_instrumentalness=" + instrumentalnessValue;
      }
      if(valenceValue !== undefined){
        urlEnd = urlEnd + "&target_valence=" + valenceValue;
      }
      if(energyValue !== undefined){
        urlEnd = urlEnd + "&target_energy=" + energyValue;
      }
      console.log(urlEnd)

      const recPlaylist = await getRecsAjax(seedA, artistIds, seedT, songIds, urlEnd, token);
      console.log(recPlaylist);



    return(recPlaylist)
}

const WritePlaylist = props => {
    const [title, setTitle] = useState("");
    const [tracks, setTracks] = useState("");
    const userId = auth.currentUser.uid;
    const token = props.token;
    const propsTracks = props.tracks;
    // console.log(props)

    // const playlistTracks = props.getRecs(token);

    // console.log(tracks)



    

    const writeToFire = e => {
        e.preventDefault();

        setTitle(e.target.title.value)
        

        const recTracks = getRecs(token, props.stateTracks, props.stateArtists);
        recTracks.then(function(result) {
            setTracks(result);
            writeTracks(tracks.tracks);
            console.log(result);
             // "Stuff worked!"
          }, function(err) {
            console.log(err); // Error: "It broke"
          });
        console.log(tracks);
        // database.ref('/playlists_' + userId).set({
        //     title: title
        // })

        function writeTracks(tracks) {
            console.log(tracks)
            for (var i=0; i<tracks.length; i++){
                let songId = tracks[i].id
                let artist = tracks[i].artists[0].name;
                let song = tracks[i].name;
                let album = tracks[i].album.name;
                let image = tracks[i].album.images[0].url;
                let spotifyUrl = tracks[i].external_urls.spotify;
                let playlistTitle = title;
    
    
                // console.log(artist, song, album)
    
                database.ref('/user_' + userId + '/' + playlistTitle + '/song_' + songId).set({
                    artist: artist,
                    song: song,
                    album: album,
                    imageUrl: image,
                    spotifyUrl: spotifyUrl
    
                })
    
            }

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