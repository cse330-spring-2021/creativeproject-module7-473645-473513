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
    const [tracks, setTracks] = useState([]);
    const [fbPlaylists, setfbPlaylists] = useState([]);
    const [start, setStart] = useState(0)
    const [counter, setCounter] = useState(0);
    const userId = auth.currentUser.uid;
    const token = props.token;
    const propsTracks = props.tracks;
    const user_id = props.user_id;
    const userPlaylists = props.userPlaylists;
    let playlistDivs = [];

    // console.log(props)

    // const playlistTracks = props.getRecs(token);

    // console.log(tracks)
    useEffect(() => {

        function getPlaylists() {
            let playlistArr = []
            database.ref('/user_' + userId).once('value', (snapshot) => {
                snapshot.forEach((snap) => {
                    let playlistName = snap.key;
                    let playlistSongs = snap.val();
                    let playlist = {
                        name: playlistName,
                        songs: playlistSongs
                    }
                    playlistArr.push(playlist);
                });
            });
            setfbPlaylists(playlistArr)
        }

        getPlaylists();
        // displayPlaylists(); 
    }, [start]);
    // setStart(start+1);



    function setPlaylistDivs() {


        playlistDivs = [];
        let songLis = [];
        // const playlists2 = playlists;
        let here = document.getElementById('showPlaylistsHere');
        for (var i=0; i< fbPlaylists.length; i++){
            // console.log('running')
            let pName = fbPlaylists[i].name;
            let pSongs = fbPlaylists[i].songs;
            // console.log(pSongs)

            playlistDivs.push(<ul id={pName}>{pName} <button value={pName} onClick={e => showSongs(e)}>Show Songs</button><button onClick={e => createPlaylist(e)}>Save to Spotify</button></ul>)
            // for (var k=0; k<pSongs.length; k++){
            
            //     console.log(pSongs[k].val());
            // }

        }

    }
    setPlaylistDivs();


    const showSongs = e => {
        let parentUl = e.target.parentElement;

        if (e.target.innerHTML == 'Show Songs'){
            for (var l=0; l<fbPlaylists.length; l++){
                if (fbPlaylists[l].name === parentUl.id){
                    let songsToShow = fbPlaylists[l].songs;
    
                    for (const obj in songsToShow){
                        let showAlbum = songsToShow[obj].album;
                        let showArtist = songsToShow[obj].artist;
                        let showName = songsToShow[obj].song;
                        let imageUrl = songsToShow[obj].imageUrl;
                        let spotifyUrl = songsToShow[obj].spotifyUrl;
                        let songId = songsToShow[obj].songId;
    
    
                        let li = document.createElement('li');
                        li.id += songId;

                        
    
                        let img = document.createElement('img');
                        img.src = imageUrl;
                        img.className += 'albumCovers';


                        
                        
                        let link = document.createElement('a');
                        link.href = spotifyUrl;
                        link.innerHTML = showName + ', ' + showArtist + ' - ' + showAlbum;

                        let span = document.createElement('span');
                        span.innerHTML = '< + link';

                        let btn1 = document.createElement('button');
                        btn1.addEventListener('click', deleteSong);
                        btn1.innerHTML = 'Remove'
                        btn1.className += 'deleteSong'


    
                        li.appendChild(img)
                        // li.innerHTML = link + ', ' + showArtist + ' - ' + showAlbum;
                        li.appendChild(link)
                        li.append(btn1);
                        parentUl.appendChild(li);
    
    
                    }
                }
            }
            e.target.innerHTML = 'Hide Songs'
        }
        else if (e.target.innerHTML = 'Hide Songs'){
            for (var i=parentUl.childNodes.length; i>4; i--){
                parentUl.removeChild(parentUl.lastChild);
            }

            e.target.innerHTML = 'Show Songs'

        }

        
    }

    const deleteSong = e => {
        e.preventDefault();
        const delSongId = e.target.parentElement.id
        const delPlayId = e.target.parentElement.parentElement.id

        database.ref('/user_' + userId + '/' + delPlayId + '/song_' + delSongId).remove();

        e.target.parentElement.parentElement.removeChild(e.target.parentElement);

        // function looping(){
            for (var i=0; i<fbPlaylists.length; i++){
                if (fbPlaylists[i].name === delPlayId){
                    let checkSongs = fbPlaylists[i].songs;
                    for (const obj in fbPlaylists[i].songs){
                        console.log(fbPlaylists[i].songs[obj])
                        if (fbPlaylists[i].songs[obj].songId === delSongId){
                            delete fbPlaylists[i].songs[obj];
                            break;                        
                        }
                    }
                }
            }

        // }

        


    }

    const createPlaylist = e => {
        // console.log(e.target.parentElement)
        let playlistName = e.target.parentElement.id
      $.ajax({
        url: "https://api.spotify.com/v1/users/"+ user_id +"/playlists",
        type: "POST",
        data: JSON.stringify({name: playlistName, public: false}),
        dataType: 'json',
        headers: { 'Authorization': 'Bearer ' + token},
        contentType: 'application/json',
    
          //   data: {name: "NP", description: "", public: false},
        // json: true,
        success: function(response){
          console.log(response);
          console.log('sucess!');
          addSongstoPlaylist(playlistName, response.id);
        },
        error: function(response){
          console.log(response)
          console.log('nope!');
        }
    
      });
    }

    function addSongstoPlaylist(playlistName, playlistId){
        console.log(userPlaylists)
        console.log(fbPlaylists)
        let songsForPlaylist = []

        for (var i=0; i<fbPlaylists.length; i++){
            if (fbPlaylists[i].name == playlistName){
                songsForPlaylist = fbPlaylists[i].songs
            }
        }

        // var playlistId = userPlaylists[0].id;
        var uris = "uris="
        for (const obj in songsForPlaylist){
            uris = uris + "spotify:track:"
            uris = uris + songsForPlaylist[obj].songId
            uris = uris + ','
        }
        const finaluri = uris.slice(0, -1)
        console.log(finaluri)
        $.ajax({
          url: "https://api.spotify.com/v1/playlists/"+ playlistId +"/tracks?" + finaluri,
          type: "POST",
          // data: JSON.stringify({name: playlistName, public: false}),
          dataType: 'text',
          headers: { 'Authorization': 'Bearer ' + token},
          contentType: 'application/json',
    
            //   data: {name: "NP", description: "", public: false},
          // json: true,
          success: function(response){
            console.log(response);
            console.log('sucess!');
          },
          error: function(response){
            console.log(response)
            console.log('nope!');
          }
    
        });
    }



    

    const writeToFire = e => {
        e.preventDefault();

        // setTitle(e.target.title.value)
        

        const recTracks = getRecs(token, props.stateTracks, props.stateArtists);
        console.log(recTracks);
        recTracks.then(function(result) {
            setTracks(result);
            writeTracks(result.tracks);


            console.log(fbPlaylists)
            console.log(result.tracks);
            // setfbPlaylists([...fbPlaylists, result.tracks]);
            setStart(start+1);
            console.log(fbPlaylists)
            // setTitle('');

            // setPlaylistDivs();

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
                    spotifyUrl: spotifyUrl,
                    songId: songId,
    
                })
    
            }

        }
        setTitle('');

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
                id='playlistTitle'
                value={title}
                onChange={e => setTitle(e.target.value)}
                />
                <input type='submit' value='Save Playlist'/>
            </form>
            <button onClick={readFromFire}>Read Playlists</button>
            <div id='showPlaylistsHere'>
                {playlistDivs}

            </div>
        </div>
    )
}

export default WritePlaylist;