import React from "react";
import "./Playlist.css";

const Playlist = props => {

    
    return (
        <div className="App">
          <div className="main-wrapper">
            <div className="playlistFunctions">

              <div className='slidDiv'>
                <label className='rangeLabel' htmlFor="danceable">Danceability<br/>
                  <input type="range" min = "0" max = "100" id="danceable" name="musicFeature" defaultValue="50" className='sliders'></input>
                </label>
              </div>

              <div className='slidDiv'>
                <label className='rangeLabel' htmlFor="energetic">Energy<br />
                  <input type="range" min = "0" max = "100" id="energetic" name="musicFeature" defaultValue="50" className='sliders'></input>
                </label>
              </div>

              <div className='slidDiv'>
                {/* remember its the reverse of values for instrumentalness */}
                <label className='rangeLabel' htmlFor="instrumentalness">Instrumentalness<br/>
                  <input type="range" min = "0" max = "100" id="instrumentalness" name="musicFeature" defaultValue="50" className='sliders'></input>
                </label><br></br>
              </div>

              <div className='slidDiv'>
                <label className='rangeLabel' htmlFor="loudness">Loudness<br/>
                  <input type="range" min = "-60" max = "0" id="loudness" name="musicFeature" defaultValue="-30" className='sliders'></input>
                </label>
              </div>

              <div className='slidDiv'>
                <label className='rangeLabel' htmlFor="valence">Happiness<br/>
                  <input type="range" min = "0" max = "100" id="valence" name="musicFeature" defaultValue="50" className='sliders'></input>
                </label>
              </div>
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