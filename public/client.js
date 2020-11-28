var currentTrackPage = 1;

//APIController gets data from spotify API
const APIController = (function() {
    
  const clientId = '61928530172545c6848cd3bcae1dcfa0';
  const clientSecret = '72c645238bf94182ab600cf30216bd03';
  //gets access token from Spotify using client ID and secret
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
  //searches for a track given a track name and artist name, then filters results
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
          if (dataTracks.tracks.items[i].artists[0].id == dataArtists.artists.items[j].id) {
            dataFiltered[dataFiltered.length] = (dataTracks.tracks.items[i]);
          }
        }
      }
    }
    else {
      dataFiltered = dataTracks.tracks.items;
    }
    for(let i = 0; i < dataFiltered.length; i++) {
      for(let j = 0; j < dataFiltered.length; j++) {
        if(dataFiltered[i].artists[0].name === dataFiltered[j].artists[0].name && i != j) {
          console.log(i);
          console.log(j);
            dataFiltered.splice(j, 1);
        }
      }
    }
    return dataFiltered;
  }
//retrieve track based off of track id
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
    divSonglist: '.song-list',
    buttonSubmit: '.btnSubmit',
    trackSearch: '.trackSearch',
    artistSearch: '.artistSearch',
    buttonDiv: '.buttonDiv',
    buttonNext: '.next_page',
    buttonPrev: '.prev_page'
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
    prev: document.querySelector(DOMElements.buttonPrev)
    }
  },
  
  //stores the token in the html using a hidden form
  storeToken(value) {
    document.querySelector(DOMElements.hfToken).value = value;
  },

  // used to create a track and insert within html
  createTrack(artist, name, id) {
    //const html = `li.track_list ${name} ${artist}`;
    const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} ${artist}</a>`;
    document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
  },
  //creates the nav buttons at the bottom of searched tracks list
  createNavButtons(resultsLength) {
    const buttonNextHTML = '<button type="submit" class="next_page">Next Page</button>';
    const buttonPrevHTML = '<button type="submit" class="prev_page">Previous Page</button>';
      
    document.querySelector(DOMElements.buttonDiv).insertAdjacentHTML('beforeend', buttonPrevHTML);
    if (currentTrackPage > 1) {
    document.querySelector(DOMElements.buttonPrev).addEventListener('click', async (e) => {
      if (currentTrackPage > 1) {
        let token = this.getStoredToken().token;
        let trackSelect = this.inputField().searchTrack;
        let tracksEndPoint = trackSelect.value;
        let tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint);
        currentTrackPage--;
        this.resetTracks(tracks.length);
          for(let i = 0; i < 5; i++) {
            if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
              this.createTrack(tracks[i + ((currentTrackPage - 1) * 5)].artists[0].name, 
              tracks[i + ((currentTrackPage - 1) * 5)].name, tracks[i + ((currentTrackPage - 1) * 5)].href);
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
    document.querySelector(DOMElements.buttonDiv).insertAdjacentHTML('beforeend', buttonNextHTML);
    if(resultsLength > 5 && currentTrackPage * 5 != resultsLength) {
      document.querySelector(DOMElements.buttonNext).addEventListener('click', async (e) => {
        let token = this.getStoredToken().token;
        let trackSelect = this.inputField().searchTrack;
        let tracksEndPoint = trackSelect.value;
        let tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint);
        currentTrackPage++;
        this.resetTracks(tracks.length);
        for(let i = 0; i < 5; i++) {
          if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
            console.log(tracks[(i + (currentTrackPage - 1) * 5)]);
            this.createTrack(tracks[i + ((currentTrackPage - 1) * 5)].artists[0].name, 
            tracks[i + ((currentTrackPage - 1) * 5)].name, tracks[i + ((currentTrackPage - 1) * 5)].href);
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
  //removes tracks and nav buttons, replaces the nav buttons
  resetTracks(resultsLength) {
    this.inputField().tracks.innerHTML = '';
    document.querySelector(DOMElements.buttonDiv).innerHTML = '';
    this.createNavButtons(resultsLength);
  },
  //removes the tracks and nav buttons from page, does not readd buttons
  resetTracksNoNav() {
    this.inputField().tracks.innerHTML = '';
    document.querySelector(DOMElements.buttonDiv).innerHTML = '';
  },
  //gets the token stored in the form
  getStoredToken() {
    return {
      token: document.querySelector(DOMElements.hfToken).value
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
  const tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint, artistEndPoint);
  // create the first page of tracks
  if (tracks) {
  for(let i = 0; i < 5; i++) {
    if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
      UICtrl.createTrack(tracks[i + ((currentTrackPage - 1) * 5)].artists[0].name, 
      tracks[i + ((currentTrackPage - 1) * 5)].name, tracks[i + ((currentTrackPage - 1) * 5)].href);
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
    //send a POST request to server to add song to DB, reload page with results
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
    //UICtrl.resetTracksNoNav();
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