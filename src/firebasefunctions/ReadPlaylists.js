// import React, { useState, useEffect } from 'react';
// import { auth, database, provider } from '../Firebase.js';
// import "./FirebaseFunctions.css";



// function ReadPlaylists(props) {
//     const [playlists, setPlaylists] = useState([]);
//     const userId = auth.currentUser.uid;

//     useEffect(() => {

//         function getPlaylists() {
//             console.log('ran')
//             let playlistArr = []
//             database.ref('/user_' + userId).once('value', (snapshot) => {
//                 snapshot.forEach((snap) => {
//                     let playlistName = snap.key;
//                     let playlistSongs = snap.val();
//                     let playlist = {
//                         name: playlistName,
//                         songs: playlistSongs
//                     }
//                     playlistArr.push(playlist);
//                 });
//             });
//             setPlaylists(playlistArr)
//         }



//         getPlaylists(); 
//         // displayPlaylists(); 
//     }, []);

//     let playlistDivs = [];
//     let songLis = [];
//     // const playlists2 = playlists;
//     let here = document.getElementById('showPlaylistsHere');
//     for (var i=0; i< playlists.length; i++){
//         // console.log('running')
//         let pName = playlists[i].name;
//         let pSongs = playlists[i].songs;
//         // console.log(pSongs)



//         playlistDivs.push(<ul id={pName}>{pName} <button value={pName} onClick={e => showSongs(e)}>Show Songs</button></ul>)
//         for (var k=0; k<pSongs.length; k++){
        
//             console.log(pSongs[k].val());
//         }

//         // let div = document.createElement('div');
//         // div.id = pName;
//         // div.className = 'showPlaylistDiv';
//         // let par = document.createElement('p');
//         // par.innerHTML = pName;
//         // div.appendChild(par);

//         // console.log(here.childNodes)
//         // here.appendChild(div);

//     }

//     const showSongs = e => {
//         let parentUl = e.target.parentElement;
//         for (var l=0; l<playlists.length; l++){
//             if (playlists[l].name === parentUl.id){
//                 let songsToShow = playlists[l].songs;

//                 for (const obj in songsToShow){
//                     let showAlbum = songsToShow[obj].album;
//                     let showArtist = songsToShow[obj].artist;
//                     let showName = songsToShow[obj].song;
//                     let imageUrl = songsToShow[obj].imageUrl;
//                     let spotifyUrl = songsToShow[obj].spotifyUrl;


//                     let li = document.createElement('li');

//                     let img = document.createElement('img');
//                     img.src = imageUrl;
//                     img.className += 'albumCovers';
                    
//                     let link = document.createElement('a');
//                     link.href = spotifyUrl;
//                     link.innerHTML = showName + ', ' + showArtist + ' - ' + showAlbum;

//                     let div = document.createElement('div');
//                     parentUl.appendChild(img)
//                     // li.innerHTML = link + ', ' + showArtist + ' - ' + showAlbum;
//                     li.appendChild(link)
//                     parentUl.appendChild(li);


//                 }
//             }
//         }
        
//     }

//     function clearAll() {
//         let parent = here.childNodes
//         for (var j=0; j<parent.length; j++){
//             while (parent[j].firstChild){
//                 parent[j].removeChild(parent[j].firstChild);
                
//             }
            
//         }
//     }

    




//     // console.log(playlists)



//     return (
//         <div>
//             <div id='showPlaylistsHere'>
//                 {playlistDivs}

//             </div>
//             <button onClick={clearAll} >Clear</button>


//         </div>
//     )
// }

// export default ReadPlaylists;