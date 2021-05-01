import React, { Component } from "react";
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
// import logo from "./logo.svg";
import "./Home.css";
import Playlist from "./Playlist";
import SignUp from './SignUp.js';
import SignIn from './SignIn.js';
import SignOut from './SignOut.js';

// create recommendations array of songs for user and then add that to the songsforPlaylists

class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      user_id:"",
      // users first 50 playlists
      userPlaylists: [{name:""}],
      //users top tracks
      tracks: [{name:"", id:"", album: {images: [{ url: "" }]}, artists: [{ name: "" }], danceability:0, loudness: 0, energy: 0, instrumentalness: 0, valence: 0, track_href: ""}],
      // users top artists
      artists:[{name:"", id: "", genres:[]}],
      // an array im working on to hold the songs that will be added to the playlist
      songsforPlaylist: [{name:"", id:"", album: {images: [{ url: "" }]}, artists: [{ name: "" }], track_href: ""}],
      no_data: false
    };

    this.getPlaylists = this.getPlaylists.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.setUser = this.setUser.bind(this);
    this.getRecs = this.getRecs.bind(this);
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
      // this.getFeatures(_token, null, null);
      this.getArtists(_token);
      this.setUser(_token);
      this.getRecs(_token);
    }

  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

 
// function that gets the current spotify user id
  setUser(token){
    $.ajax({
      url: "	https://api.spotify.com/v1/me",
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
          user_id: data.id,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }
// function that gets current user's first 50 playlists
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
// function that gets current user's top 50 tracks
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
        this.getFeatures();
        // this.sortTracks();
        console.log(this.state)
      }
    });
  }
//function that gets user recommendations
getRecs(token){
  // console.log(this.state)
  var artistIds = "";
  // for(var i = 0; i < 3; i++){
  //   artistIds = artistIds + this.state.artists[i].id
  //   artistIds = artistIds + ","
  // }
  // var songIds = ""
  // for(var j = 0; j < 2; j++){
  //   songIds = songIds + this.state.tracks[j].id
  //   songIds = songIds + ","
  // }
  // sliders are all undefined rn
    var urlEnd = ""
    if(document.getElementById("loudness") !== null && document.getElementById("danceable") !== null && document.getElementById("instrumentalness") !== null && document.getElementById("valence") !== null && document.getElementById("energetic") !== null){
      var loudnessValue = (document.getElementById("loudness").value);
      var danceabiliityValue = (document.getElementById("danceable").value)/100;
      var instrumentalnessValue = (document.getElementById("instrumentalness").value)/100;
      var valenceValue = (document.getElementById("valence").value)/100;
      var energyValue = (document.getElementById("energetic").value)/100;
    }
    urlEnd = urlEnd + "target_loudness=" + loudnessValue + "&target_valence=" + valenceValue + "&target_energy=" + energyValue + "&target_instrumentalness=" + instrumentalnessValue + "&target_danceability=" + danceabiliityValue;
    console.log(urlEnd)
    console.log(urlEnd)
  $.ajax({
    url: "https://api.spotify.com/v1/recommendations",
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
        // tracks: data.items,
        no_data: false /* We need to "reset" the boolean, in case the
                          user does not give F5 and has opened his Spotify. */
      });

    }
  })
}

// function that gets current user's top 50 artists
  getArtists(token){
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/artists?limit=50",
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
          artists: data.items,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

// this function gets the audio features from a song
// it runs a ton of times though, causes a 429 error
  getFeatures(){
    var tracksforFeatures = "";
    for(var f = 0; f < this.state.tracks.length-1; f++){
      if(this.state.tracks[f].id !== "undefined"){
        tracksforFeatures = tracksforFeatures+this.state.tracks[f].id
        tracksforFeatures = tracksforFeatures+","
      }
    } 
    tracksforFeatures = tracksforFeatures + this.state.tracks[this.state.tracks.length-1].id
    $.ajax({
      url: "https://api.spotify.com/v1/audio-features?ids=" + tracksforFeatures,
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      },
      success: data => {
        // Checks if the data is not empty
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }
        var tempTracks = this.state.tracks;
        for(var k = 0; k < this.state.tracks.length; k++){
          tempTracks[k].danceability = data.audio_features[k].danceability;
          tempTracks[k].energy = data.audio_features[k].energy;
          tempTracks[k].instrumentalness = data.audio_features[k].instrumentalness;
          tempTracks[k].loudness = data.audio_features[k].loudness;
          tempTracks[k].track_href = data.audio_features[k].track_href;
        }
       
        this.setState({
          tracks: tempTracks,
          no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
      }
    });
  }

  sortTracks(){
    var but = document.getElementById("createPlaylist");
    // but.addEventListener("click", this.createPlaylist(this.state.token));
    // var loudnessValue = (document.getElementById("loudness").value);
    // var danceabiliityValue = (document.getElementById("danceable").value)/100;
    // var instrumentalnessValue = (document.getElementById("instrumentalness").value)/100;
    // var valenceValue = (document.getElementById("valence").value)/100;
    // var energyValue = (document.getElementById("energy").value)/100;

    var songs = [];
    // all these orders are random, need to fix
    // var uDance = 
    // var lDance
    // var uLoud
    // var lLoud
    // var uInst
    // var lInst
    // var uVal
    // var lVal
    // var uEn
    // var lEn
    // if()

  }
// function is in progress 
// getting POST errors
  createPlaylist(token){
    $.ajax({
      url: "https://api.spotify.com/v1/users/"+ this.state.user_id +"/playlists",
      // type: "POST",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        // console.log("success")
        if(!data) {
          this.setState({
            no_data: true,
          });
          return;
        }
        

        this.setState({
          // tracks: tempTracks,
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
            <div id = "playlists">
            <Playlist
              userPlaylists={this.state.userPlaylists}
              tracks={this.state.tracks}
              createPlaylist={this.state.createPlaylist}
              token={this.state.token}
              songsforPlaylist={this.state.songsforPlaylist}
              artists={this.state.artists}
            />
            </div>

          )}
            
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}
        </header>
        <br />
        <SignOut />
      </div>
    );
  }
}
export default Home;
