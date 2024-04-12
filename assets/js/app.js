const APIController = (function() {
    
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
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }
    }
})();

const load = async () => {
    const token = await APIController.getToken();
    const genres = await APIController.getGenres(token);
    const playlists = await APIController.getPlaylistsByGenre(token, genres[4]);
    const tracks = await APIController.getTracks(token, playlists[1].tracks.href);
    const track = await APIController.getTrack(token, tracks[2].track.href);
    console.log(token);
    console.log(genres);
    console.log(playlists);
    console.log(tracks);
    console.log(track);
    console.log(track.name);
}

load();