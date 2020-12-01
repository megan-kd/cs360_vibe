//**********************************************************************
// File:				client.js
// Author:		  Group #4
// Date:				11/29/2020
// Class:				Web Frameworks
// Assignment:	Vibe Of
// Purpose:			client side functionality that interacts with the 
//              Spotify API to search and display songs
//         
//**********************************************************************
var currentTrackPage = 1;

//APIController gets data from spotify API
const APIController = (function() {
    
  const clientId = '61928530172545c6848cd3bcae1dcfa0';
  const clientSecret = '72c645238bf94182ab600cf30216bd03';
  

/*************************************************************************
Function:    _getToken

Description: gets access token from Spotify using client ID and secret

Parameters:  none

Returned:    access_token - a string that acts as access token
*************************************************************************/
  const _getToken = async () => {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: 'grant_type=client_credentials'
    });
    const data = await result.json();
    return data.access_token;
  }
/*************************************************************************
Function:    _getTracksBySearch

Description: searches for a track given a track name and artist name, 
             then filters results

Parameters:  token          - access token for spotify API
             tracksEndPoint - search parameter provided by user for track
             artistEndPoint - search parameter provided by user for artist

Returned:    dataFiltered - array of track objects
*************************************************************************/
  const _getTracksBySearch = async (token, tracksEndPoint, artistEndPoint) => {
    const limit = 50;
    let dataFiltered = [];
    const resultTracks = await fetch(` https://api.spotify.com/v1/search?q=track:${tracksEndPoint}&type=track&limit=${limit}`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + token}
    });
    const dataTracks = await resultTracks.json();
    if (artistEndPoint) {
      const resultArtists = await fetch(` https://api.spotify.com/v1/search?q=${artistEndPoint}&type=artist&limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
      });
      const dataArtists = await resultArtists.json();
      for(let i = 0; i < 50; i++) {
        for (let j = 0; j < dataArtists.artists.items.length; j++) {
          if (dataTracks.tracks.items[i].artists[0].id == 
              dataArtists.artists.items[j].id) {
            dataFiltered[dataFiltered.length] = 
                                        (dataTracks.tracks.items[i]);
          }
        }
      }
    }
    else {
      dataFiltered = dataTracks.tracks.items;
    }
    for(let i = 0; i < dataFiltered.length; i++) {
      for(let j = 0; j < dataFiltered.length; j++) {
        if(dataFiltered[i].artists[0].name === 
           dataFiltered[j].artists[0].name && i != j) {
          console.log(i);
          console.log(j);
            dataFiltered.splice(j, 1);
        }
      }
    }
    return dataFiltered;
  }

/*************************************************************************
Function:    _getTrack

Description: retrieve track based off of track id

Parameters:  token          - access token for spotify API
             tracksEndPoint - search parameter to search for track

Returned:    data - a single track object
*************************************************************************/

const _getTrack = async (token, trackEndPoint) => {

  const result = await fetch(`${trackEndPoint}`, {
    method: 'GET',
    headers: { 'Authorization' : 'Bearer ' + token}
  });

  const data = await result.json();
  return data;
}
//functions to return for public use
return {
  getToken() {
    return _getToken();
  },
  getTracksBySearch(token, tracksEndPoint, artist) {
    return _getTracksBySearch(token, tracksEndPoint, artist);
  },
  getTrack(token, tracksEndPoint) {
    return _getTrack(token, tracksEndPoint);
  }
}
})();

//UIController controls displaying songs and such
const UIController = (function(APICtrl) {
  //object to hold references to html selectors
  const DOMElements = {
    hfToken: '#hidden_token',
    hfHasVoted: '#hidden_has_voted',
    divSonglist: '.song-list',
    buttonSubmit: '.btnSubmit',
    trackSearch: '.trackSearch',
    artistSearch: '.artistSearch',
    buttonDiv: '.buttonDiv',
    buttonNext: '.next_page',
    buttonPrev: '.prev_page',
    buttonExport: '#export-playlist-btn',
    likeButtonWrapper: '.vibe-song-list'
  }

  //public methods
  return {
  //method to get input fields
  inputField() {
    return {
    tracks: document.querySelector(DOMElements.divSonglist),
    searchTrack: document.querySelector(DOMElements.trackSearch),
    searchArtist: document.querySelector(DOMElements.artistSearch),
    submit: document.querySelector(DOMElements.buttonSubmit),
    next: document.querySelector(DOMElements.buttonNext),
    prev: document.querySelector(DOMElements.buttonPrev),
    export: document.querySelector(DOMElements.buttonExport),
    like: document.querySelector(DOMElements.likeButtonWrapper),
    }
  },
  
/*************************************************************************
Function:    storeToken

Description: stores a given token in a hidden form within HTML

Parameters:  value - spotify access token

Returned:    none
*************************************************************************/
  storeToken(value) {
    document.querySelector(DOMElements.hfToken).value = value;
  },
/*************************************************************************
Function:    setStoredHasVoted

Description: stores a boolean in the html that if false allows the user to
             send a vote request. Reason its stored here is really 
             comlicated but more or less the user was able to spam requests
             and slow the server down immensly. Only sets to true because
             you can't delete your vote.

Parameters:  none

Returned:    none
*************************************************************************/
  setStoredHasVoted() {
    document.querySelector(DOMElements.hfHasVoted).value = "true";
  },
/*************************************************************************
Function:    createTrack

Description: used to create a track and insert within html

Parameters:  artist - name of the artist of track
             name   - name of track
             id     - id of track

Returned:    none
*************************************************************************/
  createTrack(artist, name, id) {
    //const html = `li.track_list ${name} ${artist}`;
    const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} ${artist}</a>`;
    document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
  },
/*************************************************************************
Function:    createNavButtons

Description: creates the nav buttons at the bottom of searched tracks list

Parameters:  resultsLength - ammount of tracks returned from a search

Returned:    none
*************************************************************************/
  createNavButtons(resultsLength) {
    const buttonNextHTML = 
    '<button type="submit" class="next_page">Next Page</button>';
    const buttonPrevHTML = 
    '<button type="submit" class="prev_page">Previous Page</button>';
      
    document.querySelector(DOMElements.buttonDiv)
            .insertAdjacentHTML('beforeend', buttonPrevHTML);
    if (currentTrackPage > 1) {
    document.querySelector(DOMElements.buttonPrev)
            .addEventListener('click', async (e) => {
      if (currentTrackPage > 1) {
        let token = this.getStoredToken().token;
        let trackSelect = this.inputField().searchTrack;
        let tracksEndPoint = trackSelect.value;
        let tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint);
        currentTrackPage--;
        this.resetTracks(tracks.length);
          for(let i = 0; i < 5; i++) {
            if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
              this.createTrack(tracks[i + ((currentTrackPage - 1) * 5)]
                              .artists[0].name, 
              tracks[i + ((currentTrackPage - 1) * 5)].name, 
              tracks[i + ((currentTrackPage - 1) * 5)].href);
            }
            else {
            i = 5;
            }
          }
        }
      });
    }
    else {
      document.querySelector(DOMElements.buttonPrev).disabled = true;
    }
    document.querySelector(DOMElements.buttonDiv)
            .insertAdjacentHTML('beforeend', buttonNextHTML);
    if(resultsLength > 5 && currentTrackPage * 5 != resultsLength) {
      document.querySelector(DOMElements.buttonNext)
              .addEventListener('click', async (e) => {
        let token = this.getStoredToken().token;
        let trackSelect = this.inputField().searchTrack;
        let tracksEndPoint = trackSelect.value;
        let tracks = await APICtrl
                     .getTracksBySearch(token, tracksEndPoint);
        currentTrackPage++;
        this.resetTracks(tracks.length);
        for(let i = 0; i < 5; i++) {
          if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
            console.log(tracks[(i + (currentTrackPage - 1) * 5)]);
            this.createTrack(tracks[i + ((currentTrackPage - 1) * 5)]
                .artists[0].name, 
            tracks[i + ((currentTrackPage - 1) * 5)].name,
            tracks[i + ((currentTrackPage - 1) * 5)].href);
          }
          else {
            i = 5;
          }
        }
      });
    }
    else {
      document.querySelector(DOMElements.buttonNext).disabled = true;
    }
  },
  
/*************************************************************************
Function:    resetTracks

Description: removes the current tracks from the screen and readds nav
             buttons

Parameters:  resultsLength - ammount of tracks returned from a search

Returned:    none
*************************************************************************/
  resetTracks(resultsLength) {
    this.inputField().tracks.innerHTML = '';
    document.querySelector(DOMElements.buttonDiv).innerHTML = '';
    this.createNavButtons(resultsLength);
  },
/*************************************************************************
Function:    resetTracks

Description: removes the tracks and nav buttons from page, does not readd
             buttons

Parameters:  resultsLength - ammount of tracks returned from a search

Returned:    none
*************************************************************************/
  resetTracksNoNav() {
    this.inputField().tracks.innerHTML = '';
    document.querySelector(DOMElements.buttonDiv).innerHTML = '';
  },
/*************************************************************************
Function:    getStoredToken

Description: gets the token stored in the form

Parameters:  resultsLength - ammount of tracks returned from a search

Returned:    none
*************************************************************************/
  getStoredToken() {
    return {
      token: document.querySelector(DOMElements.hfToken).value
    }
  },
/*************************************************************************
Function:    getStoredHasVoted

Description: gets the hasVoted value stored in the hidden form

Parameters:  none

Returned:    none
*************************************************************************/
  getStoredHasVoted() {
    return {
      hasVoted: document.querySelector(DOMElements.hfHasVoted).value
    }
  }
}
})(APIController);

//main controller that sets up listeners
const APPController = (function(UICtrl, APICtrl) {
  const DOMInputs = UICtrl.inputField();
  //starts the page by storing the token
  const startPage = async () => {
    //get the token
    const token = await APICtrl.getToken();           
    //store the token onto the page
    UICtrl.storeToken(token);
  }


  // create search button listener
  DOMInputs.submit.addEventListener('click', async (e) => {
  currentTrackPage = 1;
  // prevent page reset
  e.preventDefault();
  //clear tracks
  UICtrl.resetTracksNoNav();
  //get the token
  const token = UICtrl.getStoredToken().token;        
  //get reference to search track input field
  const trackSelect = UICtrl.inputField().searchTrack;
  //get reference to search artist input field
  const artistSelect = UICtrl.inputField().searchArtist;
  //get the track endpoint based off of value in track input field
  const tracksEndPoint = trackSelect.value;
  //get the artist endpoint based off of the value in artist input field
  const artistEndPoint = artistSelect.value;
  // get the list of tracks from spotify
  const tracks = await APICtrl.getTracksBySearch(token, 
                                                 tracksEndPoint, 
                                                 artistEndPoint);
  // create the first page of tracks
  if (tracks) {
  for(let i = 0; i < 5; i++) {
    if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
      UICtrl.createTrack(tracks[i + ((currentTrackPage - 1) * 5)]
            .artists[0].name, 
      tracks[i + ((currentTrackPage - 1) * 5)].name, 
      tracks[i + ((currentTrackPage - 1) * 5)].href);
    }
    else {
      i = 5;
    }
  }
  }
  UICtrl.createNavButtons(tracks.length);
  });

  // create song selection listener
  DOMInputs.tracks.addEventListener('click', async (e) => {
    // prevent page reset
    e.preventDefault();
    // get the token
    const token = UICtrl.getStoredToken().token;
    // get the track endpoint like above
    const trackEndpoint = e.target.id;
    //get the track object from spotify
    const track = await APICtrl.getTrack(token, trackEndpoint);
    //send a POST request to server to add song to DB,
    // reload page with results
    fetch('/addSong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(track),
    })
    .then(function(response) {
      if(response.ok) {
        console.log('Song was Sent');
        location.reload(true);
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});

// create listener for export button
  DOMInputs.export.addEventListener('click', async (e) => {
    // prevent page reset
    e.preventDefault();
    // get export page
    fetch('/exportPlaylist', {
      method: 'GET'
    }).then (function(response) {
      if(response.ok) {
        console.log('Playlist was Exported');
        window.location = '/exportPlaylist';
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
  });

  //create listener for like buttons
  DOMInputs.like.addEventListener('click', async (e) => {
    // prevent page reset
    e.preventDefault();
    if (e.target.nodeName === 'BUTTON' ||
        e.target.parentElement.nodeName === 'BUTTON') {
    if (e.target.nodeName === 'BUTTON') {
      var numVotes = e.target
                      .parentElement.children[1].children[1];
      var pElementWhoUploaded = e.target.parentElement
                                 .previousSibling.previousSibling
                                 .children[0].innerHTML;
    }
    else {
      var numVotes = e.target.parentElement.parentElement
                      .children[1].children[1];
      var pElementWhoUploaded = e.target.parentElement
                                 .parentElement.previousSibling
                                 .previousSibling.children[0]
                                 .innerHTML;
    }
    var whoUploaded = pElementWhoUploaded.slice(13);
    var jsonData = {"WhoUploaded": whoUploaded};
    var hasVoted = UICtrl.getStoredHasVoted().hasVoted;
    console.log(hasVoted);
    if (hasVoted === "false") {
      UICtrl.setStoredHasVoted();
      numVotes.innerHTML++;
      fetch('/incrementLike', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
      body: JSON.stringify(jsonData),
      keepalive: true,
      }).then (function(response) {
      if(response.ok) {
        console.log('Like was incremented');
          return;
        }
        throw new Error('Request failed.');
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    else 
    {
      console.log('already voted today');
      alert("you already voted today");
    }
  }
  });
//return the init function to setup and run everything
  return {
    init() {
        console.log('App is starting');
        startPage();
    }
}
})(UIController, APIController);

//prevent enter from being pressed when input forms are being typed in
window.onload = (function() {
  window.addEventListener("keydown", event =>{
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

console.log('Client stuff is running');
//setup everything defined above
APPController.init();