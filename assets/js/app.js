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
            /**
             * Retrieves html elements for input fields
             * @return  {Object}    genre select text input field
             * @return  {Object}    genre select submit button
             * @return  {Object}    playlist select choice input field
             * @return  {Object}    playlist select submit button
             */
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                submitGenre: document.querySelector(DOMElements.submitGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                submitPlaylist: document.querySelector(DOMElements.submitPlaylist),
                songList: document.querySelector(DOMElements.songContainer)
            }
        },
        autocompleteGenres(genres) {
            /**
             * Activates autocomplete on genre search bar
             * @param   {[String]}  genres Array of strings denoting genreIds
             */
            $(DOMElements.selectGenre).autocomplete({
                source: function(request, response) {
                    var results = $.ui.autocomplete.filter(genres, request.term);
            
                    response(results.slice(0, 10));
                }
            });
        },
        createPlaylist(text, value) {
            /**
             * Create playlist selection option
             * @param   {String}    text playlist title
             * @param   {String}    value playlist uri
             */
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        createTrack(name, artist, imageURL) {
            /**
             * Create track html element
             * @param   {String}    name        track title
             * @param   {String}    artist      artist name
             * @param   {String}    imageURL    link to album cover image
             */
            const html = 
            `<div class="card is-background-dark m-0" style="--bulma-card-radius:0; width:100%">
                <div class="card-content py-0">
                    <div class="content grid">
                        <h4 class="mt-3 cell">${name} by ${artist}</h4>
                        <img class="cell" src=${imageURL} height="50px" width="50px">
                    </div></div></div>`;
            document.querySelector(DOMElements.songContainer).insertAdjacentHTML('beforeend', html);
        },
        resetTracks() {
            /**
             * Resets track list
             */
            this.inputField().songList.innerHTML = '';
        },
        resetPlaylist() {
            /**
             * Resets playlist selection options
             */
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        storeToken(value) {
            /**
             * Stores hidden token
             * @param   {String}    value token
             */
            document.querySelector(DOMElements.accessToken).value = value;
        },
        getStoredToken() {
            /**
             * Gets hidden token
             * @return  {String}    token
             */
            return {
                token: document.querySelector(DOMElements.accessToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl,SPTCtrl) {
    
    // DOM input fields
    const DOMInputs = UICtrl.inputField();

    const loadGenres = async () => {
        /**
         * Load genres and activate autocomplete
         */
        const token = await SPTCtrl.getToken();
        const genres = await SPTCtrl.getGenres(token);
        UICtrl.storeToken(token);
        UICtrl.autocompleteGenres(genres);
    }

    DOMInputs.submitGenre.addEventListener('click', async () => {
        /**
         * Event Listener for genre submission button.
         * Retrieves and displays playlists based on genre.
         */
        const token = UICtrl.getStoredToken().token;
        const genreSelect = UICtrl.inputField().genre;
        const genreId = genreSelect.value;

        localStorage.setItem('genre',genreId);
        UICtrl.resetPlaylist();
        UICtrl.inputField().submitPlaylist.style.display = 'flex';
        genreSelect.value = ''; // Reset genre select input field

        // If genre has playlists display the options
        // If an error occurs, remove the submssion button, and inform user
        try {
            const playlists = await SPTCtrl.getPlaylistsByGenre(token, genreId);
            playlists.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
        } catch (error) {
            UICtrl.inputField().submitPlaylist.style.display = 'none';
            UICtrl.createPlaylist('No playlist available for this genre.')
        }
    });

    DOMInputs.submitPlaylist.addEventListener('click', async (e) => {
        /**
         * Event Listener for playlist submission button.
         * Retrieves and displays tracks from the selected playlist.
         */

        e.preventDefault();
        UICtrl.resetTracks(); // Reset track display

        const token = UICtrl.getStoredToken().token;
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.value;
        const tracks = await SPTCtrl.getTracks(token, tracksEndPoint);

        // Create track card for each track in the playlist
        tracks.forEach(async (el) => {
            const track = await SPTCtrl.getTrack(token, el.track.href);
            UICtrl.createTrack(track.name, track.artists[0].name, track.album.images[2].url);
        });
    });

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, SpotifyController);

APPController.init();