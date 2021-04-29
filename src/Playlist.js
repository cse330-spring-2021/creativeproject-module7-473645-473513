import React from "react";
import "./Playlist.css";


const Playlist = props => {
    const playlists = []
    for(var i = 0; i < props.items.length; i++){
        playlists.push(<p key = {props.items[i].name}>{props.items[i].name}</p>)
    }
    return (
        <div className="App">
          <div className="main-wrapper">
            <div className="playlistFunctions">
                <input type="radio" id="danceable" name="musicFeature" value="danceable"></input>
                <label htmlFor="danceable">Danceability</label>
                <input type="radio" id="energetic" name="musicFeature" value="energetic"></input>
                <label htmlFor="energetic">Energetic</label>
                <input type="radio" id="instrumentalness" name="musicFeature" value="instrumentalness"></input>
                <label htmlFor="instrumentalness">Instrumentalness</label>
                <input type="radio" id="popular" name="musicFeature" value="popular"></input>
                <label htmlFor="popular">Popular</label>
                <input type="radio" id="loudness" name="musicFeature" value="loudness"></input>
                <label htmlFor="loudness">Loudness</label>
            </div>
            <div className="playlists">
                <ul>
                     {playlists}
                </ul>
            </div>
          </div>
        </div>
      );
}

export default Playlist;