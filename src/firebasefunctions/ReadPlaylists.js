import React, { useState, useEffect } from 'react';
import { auth, database, provider } from '../Firebase.js';


function ReadPlaylists(props) {
    const [playlists, setPlaylists] = useState([]);
    const userId = auth.currentUser.uid;

    useEffect(() => {

        function getPlaylists() {
            console.log('ran')
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
            setPlaylists(playlistArr)
        }



        getPlaylists(); 
        // displayPlaylists(); 
    }, []);

    let playlistDivs = [];
    let songLis = [];
    // const playlists2 = playlists;
    let here = document.getElementById('showPlaylistsHere');
    for (var i=0; i< playlists.length; i++){
        // console.log('running')
        let pName = playlists[i].name;
        let pSongs = playlists[i].songs;
        // console.log(pSongs)



        playlistDivs.push(<ul id={pName}>{pName} <button value={pName} onClick={e => showSongs(e)}>Show Songs</button></ul>)
        for (var k=0; k<pSongs.length; k++){
        
            console.log(pSongs[k].val());
        }

        // let div = document.createElement('div');
        // div.id = pName;
        // div.className = 'showPlaylistDiv';
        // let par = document.createElement('p');
        // par.innerHTML = pName;
        // div.appendChild(par);

        // console.log(here.childNodes)
        // here.appendChild(div);

    }

    const showSongs = e => {
        let parentUl = e.target.parentElement;
        for (var l=0; l<playlists.length; l++){
            console.log(playlists[l].name, parentUl.id)
            if (playlists[l].name === parentUl.id){
                let songsToShow = playlists[l].songs;

                for (const obj in songsToShow){
                    let showAlbum = songsToShow[obj].album
                    let showArtist = songsToShow[obj].artist
                    let showName = songsToShow[obj].song
                    console.log(showAlbum, showArtist, showName)

                    let li = document.createElement('li');
                    li.innerHTML = showName + ', ' + showArtist + ' - ' + showAlbum;
                    parentUl.appendChild(li);


                }
            }
        }
        
    }

    function clearAll() {
        let parent = here.childNodes
        for (var j=0; j<parent.length; j++){
            while (parent[j].firstChild){
                parent[j].removeChild(parent[j].firstChild);
                
            }
            
        }
    }

    




    // console.log(playlists)



    return (
        <div>
            <div id='showPlaylistsHere'>
                {playlistDivs}

            </div>
            <button onClick={clearAll} >Clear</button>


        </div>
    )
}

export default ReadPlaylists;