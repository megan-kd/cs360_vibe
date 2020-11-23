var currentTrackPage = 1;
const APIController = (function() {
    
  const clientId = '61928530172545c6848cd3bcae1dcfa0';
  const clientSecret = '72c645238bf94182ab600cf30216bd03';
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

  const _getTracksBySearch = async (token, tracksEndPoint) => {
   const limit = 50;
    const result = await fetch(` https://api.spotify.com/v1/search?q=track:${tracksEndPoint}&type=track&limit=${limit}`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });
    const data = await result.json();
    return data.tracks.items;
}


  return {
    getToken() {
      return _getToken();
    },
    getTracksBySearch(token, tracksEndPoint) {
      return _getTracksBySearch(token, tracksEndPoint);
    }
  }
})();

const UIController = (function(APICtrl) {
  //object to hold references to html selectors
  const DOMElements = {
      hfToken: '#hidden_token',
      divSonglist: '.song-list',
      buttonSubmit: '.btnSubmit',
      trackSearch: '.trackSearch',
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
          submit: document.querySelector(DOMElements.buttonSubmit),
          next: document.querySelector(DOMElements.buttonNext),
          prev: document.querySelector(DOMElements.buttonPrev)
        }
    },
    storeToken(value) {
      document.querySelector(DOMElements.hfToken).value = value;
    },
    // need method to create a track list group item 
    createTrack(artist, name, id) {
      //const html = `li.track_list ${name} ${artist}`;
      const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name} ${artist}</a>`;
      document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
      
    },
    createNavButtons() {
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
        this.resetTracks();
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
      if(currentTrackPage * 5 != 50) {
      document.querySelector(DOMElements.buttonNext).addEventListener('click', async (e) => {
        let token = this.getStoredToken().token;
        let trackSelect = this.inputField().searchTrack;
        let tracksEndPoint = trackSelect.value;
        let tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint);
        currentTrackPage++;
        this.resetTracks();
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
    resetTracks() {
      this.inputField().tracks.innerHTML = '';
      document.querySelector(DOMElements.buttonDiv).innerHTML = '';
      this.createNavButtons();
    },
    resetTracksNoNav() {
      this.inputField().tracks.innerHTML = '';
      document.querySelector(DOMElements.buttonDiv).innerHTML = '';
    },
    getStoredToken() {
      return {
        token: document.querySelector(DOMElements.hfToken).value
      }
    }
  }
})(APIController);

const APPController = (function(UICtrl, APICtrl) {
  const DOMInputs = UICtrl.inputField();
  // get genres on page load
  const startPage = async () => {
    //get the token
    const token = await APICtrl.getToken();           
    //store the token onto the page
    UICtrl.storeToken(token);
}


// create submit button click event listener
  DOMInputs.submit.addEventListener('click', async (e) => {
  currentTrackPage = 1;
  // prevent page reset
  e.preventDefault();
  // clear tracks
  UICtrl.resetTracksNoNav();
  //get the token
  const token = UICtrl.getStoredToken().token;        
  // get the playlist field
  //const playlistSelect = UICtrl.inputField().playlist;
  const trackSelect = UICtrl.inputField().searchTrack;
  //console.log(trackSelect);
  // get track endpoint based on the selected playlist
  // const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
  const tracksEndPoint = trackSelect.value;
  // get the list of tracks
  //const tracks = await APICtrl.getTracks(token, tracksEndPoint);
  const tracks = await APICtrl.getTracksBySearch(token, tracksEndPoint);
  console.log(tracks.length);
  // create a track list item
  for(let i = 0; i < 5; i++) {
    if ((i + (currentTrackPage - 1) * 5) < tracks.length) {
      UICtrl.createTrack(tracks[i + ((currentTrackPage - 1) * 5)].artists[0].name, 
      tracks[i + ((currentTrackPage - 1) * 5)].name, tracks[i + ((currentTrackPage - 1) * 5)].href);
    }
    else {
      i = 5;
    }
  }
  UICtrl.createNavButtons();
  });
  return {
    init() {
        console.log('App is starting');
        startPage();
    }
}
})(UIController, APIController);

window.onload = (function() {
  window.addEventListener("keydown", event =>{
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});

console.log('Client stuff is running');

APPController.init();