import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
// import logo from "./logo.svg";
import "./App.css";
import Playlist from "./Playlist";

class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      userPlaylists: [{name:""}],
      tracks: [{name:"", id:""}],
      //is_playing: "Paused",
      //progress_ms: 0,
      no_data: false
    };

    this.getPlaylists = this.getPlaylists.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.tick = this.tick.bind(this);
  }



  componentDidMount() {
    // Set token
    let _token = hash.access_token;

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getPlaylists(_token);
      this.getTracks(_token);
    }

    // set interval for polling every 5 seconds
    this.interval = setInterval(() => this.tick(), 5000);
  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getPlaylists(this.state.token);
      this.getTracks(this.state.token);
    }
  }

  getPlaylists(token){
    $.ajax({
      url: "https://api.spotify.com/v1/me/playlists?limit=50",
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

        this.setState({
          userPlaylists: data.items,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  getTracks(token){
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks?limit=50",
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

        this.setState({
          tracks: data.items,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  getFeatures(token, id){
    $.ajax({
      url: ("https://api.spotify.com/v1/audio-features/" + {id}) ,
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

        this.setState({
          danceability: data.items,
          energy: data.energy,
          instrumentalness: data.instrumentalness,
          loudness: data.loudness,
          track_href: data.track_href,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && !this.state.no_data && (
            /*<Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />*/
            <Playlist
              userPlaylists={this.state.userPlaylists}
              tracks={this.state.tracks}
            />
          )}
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}
        </header>
      </div>
    );
  }
}

export default App;