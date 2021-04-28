import React from "react";
import "./Playlist.css";


const Playlist = props => {
    const playlists = []
    for(var i = 0; i < props.items.length; i++){
        playlists.push(<p>{props.items[i].name}</p>)
    }
    return (
        <div className="App">
          <div className="main-wrapper">
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