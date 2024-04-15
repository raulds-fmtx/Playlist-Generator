const SpotifyController = (function() {
    
    const clientId = '0863b45142ff42c4808368e1db56c017';
    const clientSecret = '8c6e634edfb24d998325dd6f1b72c3e2';

    // private methods
    const _getToken = async () => {
        /**
         * Retrieves an access token for the Spotify Web API
         * @return {String} data access token
         */
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
    
    const _getGenres = async (token) => {
        /**
         * Retrieves list of Spotify genreIDs
         * @param  {String}   token  data access token
         * @return {[String]}        array of genreIDs 
         */
        const result = await fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.genres;
    }

    const _getPlaylistsByGenre = async (token, genreId) => {
        /**
         * Retrieves list of Spotify playlists for a given genre.
         * @param   {String}   token    data access token
         * @param   {String}   genreID  name of a genre
         * @return  {[Object]}          array of spotify playlists 
         */
        const limit = 10;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        /**
         * Retrieves list of tracks from a spotify playlist.
         * @param   {String}   token          data access token
         * @param   {String}   tracksEndPoint URL for a playlist
         * @return  {[Object]}                Array of track objects
         */
        const limit = 10;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        /**
         * Retrieves list of tracks from a spotify playlist.
         * @param   {String}  token          data access token
         * @param   {String}  trackEndPoint  URL for a track
         * @return  {Object}                 track object
         */
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistsByGenre(token, genreId) {
            return _getPlaylistsByGenre(token, genreId);
        },
        getRecommendations(token, genreId) {
            return _getRecommendations(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

const UIController = (function() {

    // Object containing relevant element id tags
    const DOMElements = {
        selectGenre: '#select-genre',
        submitGenre: '#submit-genre',
        selectPlaylist: '#select-playlist',
        submitPlaylist: '#submit-playlist',
        songContainer: '#song-container',
        accessToken: '#hidden-token'
    }

    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                submitGenre: document.querySelector(DOMElements.submitGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                submitPlaylist: document.querySelector(DOMElements.submitPlaylist),
                songList: document.querySelector(DOMElements.songContainer)
            }
        },
        autocompleteGenres(genres) {
            $(DOMElements.selectGenre).autocomplete({
                source: function(request, response) {
                    var results = $.ui.autocomplete.filter(genres, request.term);
            
                    response(results.slice(0, 10));
                }
            });
        },
        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        createTrack(id, name) {
            const html = 
            `<div class="card is-background-dark m-0" style="--bulma-card-radius:0; width:100%" id="${id}">
                <div class="card-content py-2">
                    <div class="content">
                        <h4 class="my-2">${name}</h4>
                    </div></div></div>`;
            document.querySelector(DOMElements.songContainer).insertAdjacentHTML('beforeend', html);
        },
        resetTracks() {
            this.inputField().songList.innerHTML = '';
        },
        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        storeToken(value) {
            document.querySelector(DOMElements.accessToken).value = value;
        },
        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.accessToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl,SPTCtrl) {
    
    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        const token = await SPTCtrl.getToken();
        UICtrl.storeToken(token);
        const genres = await SPTCtrl.getGenres(token);
        UICtrl.autocompleteGenres(genres);
    }

    DOMInputs.submitGenre.addEventListener('click', async () => {
        UICtrl.resetPlaylist();
        const token = UICtrl.getStoredToken().token;
        const genreSelect = UICtrl.inputField().genre;
        const genreId = genreSelect.value;
        genreSelect.value = '';
        localStorage.setItem('genre',genreId);
        const playlists = await SPTCtrl.getPlaylistsByGenre(token, genreId);
        playlists.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });

    DOMInputs.submitPlaylist.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token;
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.value;
        const tracks = await SPTCtrl.getTracks(token, tracksEndPoint);
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name));
        // Display track cover image and artist?
    });

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, SpotifyController);

APPController.init();