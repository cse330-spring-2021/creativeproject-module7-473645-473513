import React from "react";
import "./Playlist.css";

const Playlist = props => {

    
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
                <label htmlFor="instrumentalness">Instrumentalness</label><br></br>
                <input type="range" min = "-60" max = "0" id="loudness" name="musicFeature" defaultValue="-30"></input>
                <label htmlFor="loudness">Loudness</label>
                <input type="range" min = "0" max = "100" id="valence" name="musicFeature" defaultValue="50"></input>
                <label htmlFor="valence">Happiness</label>
            </div>
            {/* <button id = "createPlaylist"> Create a Playlist </button> */}
            <ul className = "createdPlaylist"></ul>
            <div className="playlists">
                
            </div>
          </div>
        </div>
      );

}

export default Playlist;