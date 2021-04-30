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


class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      user_id:"",
      // users first 50 playlists
      userPlaylists: [{name:""}],
      //users top tracks
      tracks: [{name:"", id:"", danceability:0, loudness: 0, energy: 0, instrumentalness: 0, track_href: ""}],
      // users top artists
      artists:[{name:"", genres:[]}],
      // an array im working on to hold the songs that will be added to the playlist
      songsforPlaylist: [{name:"", id:"", danceability:0, loudness: 0, energy: 0, instrumentalness: 0, track_href: ""}],
      no_data: false
    };

    this.getPlaylists = this.getPlaylists.bind(this);
    this.getTracks = this.getTracks.bind(this);
    this.getFeatures = this.getFeatures.bind(this);
    this.getArtists = this.getArtists.bind(this);
    this.setUser = this.setUser.bind(this);
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
      // this.getFeatures(_token, null, null);
      this.getArtists(_token);
      this.setUser(_token);
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
      // this.getFeatures(this.state.token);
      this.getArtists(this.state.token);
      this.setUser(this.state.token);
    }
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

        for(var i = 0; i < this.state.tracks.length; i++){
          this.getFeatures(this.state.tracks[i].id, i)
        }
      }
    });
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
        // // console.log(this.state.artists)
        // for(var i = 0; i < this.state.artists.length; i++){
        //   this.getGenres(token, this.state.artists[i].id, i)
        // }
        this.sortTracks();

      }
    });
  }

  // getGenres(token, id, index){

  // }
// this function gets the audio features from a song
// it runs a ton of times though, causes a 429 error
  getFeatures(id, index){
    $.ajax({
      url: "https://api.spotify.com/v1/audio-features/" + id,
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
        tempTracks[index].danceability = data.danceability;
        tempTracks[index].energy = data.energy;
        tempTracks[index].instrumentalness = data.instrumentalness;
        tempTracks[index].loudness = data.loudness;
        tempTracks[index].track_href = data.track_href;

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
    but.addEventListener("click", this.createPlaylist(this.state.token));
    var feature = document.getElementsByName("musicFeature");
    var word;
    for(var i = 0; i < feature.length; i++){
      if(feature[i].checked){
        word = feature[i].value;
      }
    }
    var songs = [];
    // all these orders are random, need to fix
    if(word === "danceability"){
      var newTracks = this.state.tracks.sort(function(a, b) {
            return a.danceability - b.danceability;
      });
      this.state.tracks = newTracks;
    }
    else if(word === "energy"){
      var newTracks = this.state.tracks.sort(function(a, b) {
            return a.energy - b.energy;
      });
      this.state.tracks = newTracks;
    }
    else if(word === "instrumentalness"){
      var newTracks = this.state.tracks.sort(function(a, b) {
            return a.instrumentalness - b.instrumentalness;
      });
      this.state.tracks = newTracks;
    }
    else if(word === "loudness"){
      var newTracks = this.state.tracks.sort(function(a, b) {
            return a.loudness - b.loudness;
      });
      this.state.tracks = newTracks;
    }

  }
// function is in progress 
// getting POST errors
  createPlaylist(token){
    $.ajax({
      url: "https://api.spotify.com/v1/users/"+ this.state.user_id +"/playlists",
      type: "POST",
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
            <Playlist
              userPlaylists={this.state.userPlaylists}
              tracks={this.state.tracks}
              createPlaylist={this.state.createPlaylist}
              token={this.state.token}
              songsforPlaylist={this.state.songsforPlaylist}
            />
            
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
