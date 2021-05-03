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
import WritePlaylist from './firebasefunctions/WritePlaylist.js';
import ReadPlaylists from './firebasefunctions/ReadPlaylists.js';

// create recommendations array of songs for user and then add that to the songsforPlaylists

class Home extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      user_id:"",
      // users first 50 playlists
      userPlaylists: [{id:"", name:""}],
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
    // this.addSongstoPlaylist = this.addSongstoPlaylist.bind(this);
    // this.createPlaylist = this.createPlaylist.bind(this);
    this.tick = this.tick.bind(this);
    // this.sortTracks = this.sortTracks.bind(this);
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
      this.getArtists(_token);
      this.setUser(_token);
      this.getRecs(_token);
      // this.createPlaylist(_token);
    }

    this.interval = setInterval(() => this.tick(), 1000);

  }

  componentWillUnmount() {
    // clear the interval to save resources
    clearInterval(this.interval);
  }

  tick() {
    if(this.state.token) {
      this.getPlaylists(this.state.token);
      this.getArtists(this.state.token);
      this.getTracks(this.state.token);
      this.getRecs(this.state.token);
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
        // console.log(this.state.userPlaylists)
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
        
      }
    });
  }
//function that gets user recommendations
getRecs(token){
  var artistIds = "";
  var seedA = ""
  for(var i = 0; i < 1; i++){
    if(this.state.artists[i] !== undefined){
      seedA = "seed_artists="
      artistIds = artistIds + this.state.artists[i].id;
      artistIds = artistIds + ",";
    }
  }
  if(this.state.artists[1] !== undefined){
    artistIds = artistIds + this.state.artists[1].id
  }
  var songIds = ""
  var seedT = ""
  for(var j = 0; j < 2; j++){
    if(this.state.tracks[j] !== undefined){
      seedT = "&seed_tracks="
      songIds = songIds + this.state.tracks[j].id
      songIds = songIds + ","
    }
  }
  if(this.state.tracks[2] !== undefined){
    songIds = songIds + this.state.tracks[2].id + "&"
  }
  // sliders are all undefined rn
    var urlEnd = ""

    if(document.getElementById("loudness") !== null && document.getElementById("danceable") !== null && document.getElementById("instrumentalness") !== null && document.getElementById("valence") !== null && document.getElementById("energetic") !== null){
      var loudnessValue = (document.getElementById("loudness").value);
      var danceabiliityValue = (document.getElementById("danceable").value)/100;
      var instrumentalnessValue = (document.getElementById("instrumentalness").value)/100;
      var valenceValue = (document.getElementById("valence").value)/100;
      var energyValue = (document.getElementById("energetic").value)/100;
      // console.log(loudnessValue, danceabiliityValue, instrumentalnessValue, valenceValue, energyValue)
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
    // console.log(urlEnd)
  $.ajax({
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

      this.setState({
        songsforPlaylist: data.tracks,
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
          tempTracks[k].valence = data.audio_features[k].valence;
        }
       
        this.setState({
          tracks: tempTracks,
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
            <div>
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true`}
              >
                Login to Spotify
              </a>
              <SignOut />
            </div>

            
          )}
          {this.state.token && !this.state.no_data && (
            <div id = "playlists">
            <Playlist
              userPlaylists={this.state.userPlaylists}
              tracks={this.state.tracks}
              // createPlaylist={this.state.createPlaylist}
              token={this.state.token}
              songsforPlaylist={this.state.songsforPlaylist}
              artists={this.state.artists}
            />
            <WritePlaylist 
                stateTracks={this.state.tracks}
                // tracks={this.state.songsforPlaylist}
                token={this.state.token}
                stateArtists={this.state.artists}
                user_id={this.state.user_id}
                userPlaylists={this.state.userPlaylists}

            />
            <br />
            {/* <ReadPlaylists /> */}
            <SignOut />

            </div>

            
            
          )}

            
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}
        </header>
        <br />
        
      </div>
    );
  }
}
export default Home;

// OLD FUNCTIONS NOT IN USE, BUT THE CODE COULD BE USEFUL, SO I WANT TO KEEP


// function is obsolete now
/*
  sortTracks(){
    this.getFeatures();
    
    if(document.getElementById("loudness") !== null && document.getElementById("danceable") !== null && document.getElementById("instrumentalness") !== null && document.getElementById("valence") !== null && document.getElementById("energetic") !== null){
      var loudnessValue = (document.getElementById("loudness").value);
      var danceabiliityValue = (document.getElementById("danceable").value)/100;
      var instrumentalnessValue = (document.getElementById("instrumentalness").value)/100;
      var valenceValue = (document.getElementById("valence").value)/100;
      var energyValue = (document.getElementById("energetic").value)/100;
    }

    var songs = [];
    // all these ranges are random, check if they can be fixed
    if(loudnessValue !== undefined){
      var uLoud = loudnessValue + 7;
      var lLoud = loudnessValue - 7;
    }
    if(danceabiliityValue !== undefined){
      var uDance = danceabiliityValue + .05;
      var lDance = danceabiliityValue - .05;
    }
    if(instrumentalnessValue !== undefined){
      var uInst = instrumentalnessValue + .05;
      var lInst = instrumentalnessValue - .05;
    }
    if(valenceValue !== undefined){
      var uVal = valenceValue + .05;
      var lVal = valenceValue - .05;
    }
    if(energyValue !== undefined){
      var uEn = energyValue + .05;
      var lEn = energyValue - .05;
    }
    for(var i = 0; i < this.state.tracks.length; i++){
      if(this.state.tracks[i].loudness < uLoud || this.state.tracks[i].loudness > lLoud){
        songs.push(this.state.tracks[i]);
      }
      else if(this.state.tracks[i].danceability < uDance || this.state.tracks[i].danceability > lDance){
        songs.push(this.state.tracks[i]);
      }
      else if(this.state.tracks[i].instrumentalness < uInst || this.state.tracks[i].instrumentalness > lInst){
        songs.push(this.state.tracks[i]);
      }
      else if(this.state.tracks[i].valence < uVal || this.state.tracks[i].valence > lVal){
        songs.push(this.state.tracks[i]);
      }
      else if(this.state.tracks[i].energy < uEn || this.state.tracks[i].energy > lEn){
        songs.push(this.state.tracks[i]);
      }
    }
  }*/
// function is in progress 
// getting POST errors

// commenting this out for now so i don't get a ton of spotify playlists on my acct

  // createPlaylist(token){
  //     console.log('create playlist')
  //     let playlistName = 'random'
  //   // $.ajax({
  //   //   url: "https://api.spotify.com/v1/users/"+ this.state.user_id +"/playlists",
  //   //   type: "POST",
  //   //   data: JSON.stringify({name: playlistName, public: false}),
  //   //   dataType: 'json',
  //   //   headers: { 'Authorization': 'Bearer ' + token},
  //   //   contentType: 'application/json',

  //   //     //   data: {name: "NP", description: "", public: false},
  //   //   // json: true,
  //   //   success: function(response){
  //   //     console.log(response);
  //   //     console.log('sucess!');
  //   //   },
  //   //   error: function(response){
  //   //     console.log(response)
  //   //     console.log('nope!');
  //   //   }

  //   // });
  //   this.addSongstoPlaylist(token);
  //   }

  /*addSongstoPlaylist(token){
    // console.log(this.state.userPlaylists)
    // console.log(this.state.songsforPlaylist)
    // var playlistId = this.state.userPlaylists[0].id;
    // console.log(playlistId)
    // var uris = "uris="
    // for(var i = 0; i < this.state.songsforPlaylist.length; i++){
    //   uris = uris + "spotify:track:"
    //   uris = uris + this.state.songsforPlaylist[i].id
    //   uris = uris + ','
    // }
    // var finaluri = uris.slice(0, -1)
    // $.ajax({
    //   url: "https://api.spotify.com/v1/playlists/"+ playlistId +"/tracks?" + finaluri,
    //   type: "POST",
    //   // data: JSON.stringify({name: playlistName, public: false}),
    //   dataType: 'text',
    //   headers: { 'Authorization': 'Bearer ' + token},
    //   contentType: 'application/json',

    //     //   data: {name: "NP", description: "", public: false},
    //   // json: true,
    //   success: function(response){
    //     console.log(response);
    //     console.log('sucess!');
    //   },
    //   error: function(response){
    //     console.log(response)
    //     console.log('nope!');
    //   }

    // });
  }

    // commenting out ends here


    /*
    success: data => {
      // Checks if the data is not empty
      if(!data) {
        // this.setState({
        //   no_data: true,
        // });
        return;
      }
      

      this.setState({
        // tracks: tempTracks,
        data.name:  // We need to "reset" the boolean, in case the
                          //user does not give F5 and has opened his Spotify. 
      });
      console.log(data)
    }*/

