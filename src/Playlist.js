import React from "react";
import "./Playlist.css";

const Playlist = props => {
    const playlists = []
    for(var i = 0; i < props.userPlaylists.length; i++){
        playlists.push(<p key={props.userPlaylists[i].id}>{props.userPlaylists[i].name}</p>)
       
    }
    // const topTracks = []
    // for(var j = 0; j < props.tracks.length; j++){
    //     topTracks.push(props.tracks[j].id)
    // }
    // const newPlaylist = []
    // for(var k = 0; k < props.songsforPlaylist.length; k++){
    //     newPlaylist.push(<a key = {props.songsforPlaylist[k].id} href={props.songsforPlaylist[k].track_href}>{props.songsforPlaylist[k].name}</a>)
    //     newPlaylist.push(<br></br>)
    // }
    // const createdPlaylist = []
    // for(var k = 0; k < props.createdPlaylist.length; k++){

    // }
    
    return (
        <div className="App">
          <div className="main-wrapper">
            <div className="playlistFunctions">
                <input type="range" min = "0" max = "100" id="danceable" name="musicFeature" defaultValue="50"></input>
                <label htmlFor="danceable">Danceability</label>
                <input type="range" min = "0" max = "100" id="energetic" name="musicFeature" defaultValue="50"></input>
                <label htmlFor="energetic">Energy</label>
                {/* remember its the reverse of values for instrumentalness */}
                <input type="range" min = "0" max = "100" id="instrumentalness" name="musicFeature" defaultValue="50"></input>
                <label htmlFor="instrumentalness">Instrumentalness</label>
                <input type="range" min = "-60" max = "0" id="loudness" name="musicFeature" defaultValue="-30"></input>
                <label htmlFor="loudness">Loudness</label>
                <input type="range" min = "0" max = "100" id="valence" name="musicFeature" defaultValue="50"></input>
                <label htmlFor="valence">Happiness</label>
            </div>
            <button id = "createPlaylist"> Create a Playlist </button>
            <ul className = "createdPlaylist"></ul>
            <div className="playlists">
                {/* <ul>
                     {playlists}
                </ul> */}
            </div>
          </div>
        </div>
      );

}

export default Playlist;