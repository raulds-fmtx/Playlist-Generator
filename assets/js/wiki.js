$(document).ready(function() {
    $('#search-wikipedia').click(function() {
        var query = $('#select-genre').val();
        if (query) {
            searchWikipedia(query);
        }
    });

    function searchWikipedia(query) {
        var apiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + encodeURIComponent(query);
        $.ajax({
            url: apiUrl,
            dataType: 'jsonp',
            success: function(data) {
                console.log('data', data);
                if (isMusicGenre(query)) {
                    displayMusicGenreDescription(query);
                } else {
                    displaySearchResults(data);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }

    function isMusicGenre(query) {
        // Add conditions to check if the query matches a music genre
        // For example, you can check if the query is one of the known music genres
        var musicGenres = [
            'rock', 'pop', 'jazz', 'hip hop', 'classical',
            'country', 'metal', 'blues', 'reggae', 'soul', 
            'funk', 'disco', 'electronic', 'techno', 'punk',
            // Add more genres here
            'ambient', 'bluegrass', 'bossa nova', 'celtic', 'chill-out',
            'chiptune', 'dancehall', 'dark ambient', 'death metal', 'drone',
            'dub', 'dubstep', 'easy listening', 'emo', 'experimental',
            'folk', 'folk rock', 'glitch', 'gothic', 'grunge',
            'hardcore punk', 'hardstyle', 'indie pop', 'industrial', 'k-pop',
            'krautrock', 'latin', 'lo-fi', 'lounge', 'math rock',
            'mellow', 'minimal', 'neoclassical', 'new age', 'noise',
            'nu metal', 'opera', 'orchestral', 'post-rock', 'progressive rock',
            'psychedelic', 'r&b', 'rap', 'rave', 'reggaeton',
            'rockabilly', 'ska', 'smooth jazz', 'space rock', 'stoner rock',
            'surf rock', 'symphonic metal', 'synth-pop', 'trance', 'tribal',
            'trip hop', 'vaporwave', 'world music', 'zouk', 'zydeco',
            // Add more genres as needed
        ];
        return musicGenres.includes(query.toLowerCase());
    }

    function displayMusicGenreDescription(genre) {
        var description = getGenreDescription(genre);
        $('#search-results').text(description);
    }

    function getGenreDescription(genre) {
        // Define descriptions for each music genre
        var descriptions = {
            'rock': 'Rock music is a broad genre of popular music that originated as "rock and roll" in the United States in the late 1940s and early 1950s.',
            'pop': 'Pop music is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom.',
            'jazz': 'Jazz is a music genre that originated in the African-American communities of New Orleans, United States, in the late 19th and early 20th centuries.',
            'hip hop': 'Hip hop music, also known as rap music, is a genre of popular music developed in the United States by inner-city African Americans and Latino Americans in the Bronx borough of New York City in the 1970s.',
            'classical': 'Classical music is art music produced or rooted in the traditions of Western culture, including both liturgical (religious) and secular music.',
            'country': 'Country music is a genre of popular music that originated in the Southern United States in the early 1920s.',
            'metal': 'Heavy metal is a genre of rock music that developed in the late 1960s and early 1970s, largely in the United Kingdom and the United States.',
            'blues': 'Blues is a music genre and musical form which was originated in the Deep South of the United States around the 1860s by African-Americans.',
            'reggae': 'Reggae is a music genre that originated in Jamaica in the late 1960s.',
            'soul': 'Soul music is a popular music genre that originated in the African American community throughout the United States in the 1950s and early 1960s.',
            'funk': 'Funk is a music genre that originated in African American communities in the mid-1960s.',
            'disco': 'Disco is a genre of dance music and a subculture that emerged in the 1970s from the United States\' urban nightlife scene.',
            'electronic': 'Electronic music is music that employs electronic musical instruments, digital instruments, or circuitry-based music technology in its creation.',
            'techno': 'Techno is a genre of electronic dance music that originated in Detroit, Michigan, in the United States during the mid-to-late 1980s.',
            'punk': 'Punk rock is a music genre that emerged in the mid-1970s. Rooted in 1960s garage rock, punk bands rejected the perceived excesses of mainstream 1970s rock.',
            // Add descriptions for the additional genres...
            'ambient': 'Ambient music is a genre of music that emphasizes tone and atmosphere over traditional musical structure or rhythm.',
            'bluegrass': 'Bluegrass music is a genre of American roots music that developed in the 1940s in the United States Appalachian region.',
            'bossa nova': 'Bossa nova is a style of Brazilian music that originated in the late 1950s and early 1960s. It combines samba rhythms with jazz influences.',
            'celtic': 'Celtic music is a broad grouping of music genres that evolved out of the folk musical traditions of the Celtic people of Western Europe.',
            'chill-out': 'Chill-out music is a genre of electronic music that is characterized by its mellow style and relaxed tempo, often incorporating elements from ambient and jazz music.',
            'chiptune': 'Chiptune, also known as chip music or 8-bit music, is a style of synthesized electronic music made using sound chips from vintage computers, video game consoles, and arcade machines.',
            'dancehall': 'Dancehall is a genre of Jamaican popular music that originated in the late 1970s. It is characterized by a deejay singing and rapping over danceable rhythms.',
            'dark ambient': 'Dark ambient is a genre of ambient music that features dark, atmospheric soundscapes often with elements of industrial or experimental music.',
            'death metal': 'Death metal is an extreme subgenre of heavy metal music that typically employs heavily distorted guitars, deep growling vocals, and fast, aggressive tempos.',
            'drone': 'Drone music is a minimalist musical style that emphasizes sustained or repeated sounds, often created with electronic instruments or synthesizers.',
            'dub': 'Dub music is a genre of reggae that emerged in the late 1960s. It is characterized by remixing and reverb effects applied to existing reggae tracks.',
            'dubstep': 'Dubstep is a genre of electronic dance music that originated in South London in the late 1990s. It is characterized by syncopated rhythms, heavy basslines, and sparse, minimalist arrangements.',
            'easy listening': 'Easy listening is a genre of music that is characterized by its relaxing and soothing sound, often featuring orchestral arrangements and melodic tunes.',
            'emo': 'Emo is a genre of rock music characterized by expressive, often confessional lyrics and emotional intensity.',
            'experimental': 'Experimental music is a genre of music that pushes the boundaries of traditional musical conventions, often incorporating unconventional sounds, structures, and techniques.',
            'folk': 'Folk music is a genre of traditional music that is passed down orally from generation to generation within a community or culture.',
            'folk rock': 'Folk rock is a hybrid music genre that combines elements of folk music and rock music, often featuring acoustic instruments and introspective lyrics.',
            'glitch': 'Glitch music is a genre of electronic music that incorporates glitches, clicks, pops, and other digital artifacts as aesthetic elements.',
            'gothic': 'Gothic music is a genre of alternative rock that emerged in the late 1970s, characterized by its dark and atmospheric sound, introspective lyrics, and dramatic aesthetics.',
            'grunge': 'Grunge is a genre of alternative rock that emerged in the Seattle area in the late 1980s. It is characterized by its distorted guitars, angst-filled lyrics, and raw, unpolished sound.',
            'hardcore punk': 'Hardcore punk is a subgenre of punk rock that emerged in the late 1970s. It is characterized by its fast tempo, aggressive lyrics, and DIY ethic.',
            'hardstyle': 'Hardstyle is a genre of electronic dance music that originated in the Netherlands in the early 2000s. It is characterized by its hard, pounding kick drum and intense, distorted synths.',
            'indie pop': 'Indie pop is a genre of alternative pop music that originated in the 1980s, characterized by its melodic hooks, lo-fi production, and DIY ethos.',
            'industrial': 'Industrial music is a genre of experimental music that originated in the 1970s, characterized by its harsh, mechanical sound, repetitive rhythms, and use of noise.',
            'k-pop': 'K-pop is a genre of popular music that originated in South Korea in the 1990s, characterized by its catchy melodies, synchronized dance routines, and visually appealing performances.',
            'krautrock': 'Krautrock is a genre of experimental rock music that originated in Germany in the late 1960s and early 1970s, characterized by its psychedelic soundscapes, minimalist arrangements, and use of electronic instruments.',
            'latin': 'Latin music is a genre of music that originated in Latin America, characterized by its rhythmic and melodic diversity, as well as its rich cultural heritage.',
            'lo-fi': 'Lo-fi music is a genre of music that is characterized by its low-fidelity sound quality, often featuring imperfections such as tape hiss, distortion, and background noise.',
            'lounge': 'Lounge music is a genre of easy listening music that originated in the 1950s and 1960s, characterized by its laid-back vibe, lush arrangements, and sophisticated sound.',
            'math rock': 'Math rock is a genre of experimental rock music that is characterized by its complex, irregular rhythms, dissonant harmonies, and intricate instrumental technique.',
            'mellow': 'Mellow music is a genre of music that is characterized by its relaxed and laid-back vibe, often featuring smooth melodies, gentle rhythms, and soothing vocals.',
            'minimal': 'Minimal music is a genre of music that is characterized by its repetitive and minimalist compositional techniques, often featuring simple melodies, steady rhythms, and sparse instrumentation.',
            'neoclassical': 'Neoclassical music is a genre of classical music that emerged in the late 20th century, characterized by its use of classical forms and structures, but with a modern twist.',
            'new age': 'New age music is a genre of music that is characterized by its soothing and meditative sound, often featuring ambient textures, nature sounds, and gentle melodies.',
            'noise': 'Noise music is a genre of experimental music that is characterized by its use of noise, distortion, and feedback as primary musical elements, often creating harsh and abrasive soundscapes.',
            'nu metal': 'Nu metal is a subgenre of heavy metal music that emerged in the late 1990s, characterized by its fusion of heavy metal with elements of hip hop, industrial, and alternative rock.',
            'opera': 'Opera is a form of music drama that originated in Italy in the late 16th century, characterized by its combination of music, drama, and spectacle, often featuring elaborate sets, costumes, and staging.',
            'orchestral': 'Orchestral music is a genre of classical music that is performed by a large ensemble known as an orchestra, typically consisting of strings, woodwinds, brass, and percussion instruments.',
            'post-rock': 'Post-rock is a genre of experimental rock music that emerged in the 1990s, characterized by its use of unconventional song structures, ambient textures, and instrumental exploration.',
            'progressive rock': 'Progressive rock is a genre of rock music that emerged in the late 1960s and early 1970s, characterized by its complex song structures, virtuosic instrumental technique, and elaborate compositions.',
            'psychedelic': 'Psychedelic music is a genre of rock music that emerged in the 1960s, characterized by its use of hallucinogenic imagery, mind-expanding lyrics, and experimental soundscapes.',
            'r&b': 'Rhythm and blues, often abbreviated as R&B, is a genre of popular music that originated in African American communities in the 1940s, characterized by its soulful vocals, gospel-inspired harmonies, and infectious rhythms.',
            'rap': 'Rap music, also known as hip hop music, is a genre of popular music that originated in African American communities in the 1970s, characterized by its rhythmic spoken lyrics and syncopated beats.',
            'rave': 'Rave music is a genre of electronic dance music that originated in the late 1980s, characterized by its fast tempo, repetitive beats, and euphoric melodies, often associated with all-night dance parties called raves.',
            'reggaeton': 'Reggaeton is a genre of Latin music that originated in Puerto Rico in the late 1990s, characterized by its blend of reggae, dancehall, and hip hop influences, as well as its distinctive dembow rhythm.',
            'rockabilly': 'Rockabilly is a genre of rock music that originated in the United States in the early 1950s, characterized by its fusion of rock and roll with elements of country and rhythm and blues music.',
            'ska': 'Ska music is a genre of Jamaican popular music that originated in the 1950s, characterized by its upbeat rhythms, horn sections, and offbeat guitar accents.',
            'smooth jazz': 'Smooth jazz is a genre of jazz music that emerged in the late 1970s, characterized by its mellow and relaxing sound, often featuring smooth melodies, gentle rhythms, and sophisticated harmonies.',
            'space rock': 'Space rock is a genre of rock music that emerged in the late 1960s and early 1970s, characterized by its cosmic themes, psychedelic soundscapes, and experimental instrumentation.',
            'stoner rock': 'Stoner rock is a genre of rock music that emerged in the 1990s, characterized by its heavy, fuzzed-out guitar riffs, slow tempos, and laid-back vibe, often associated with recreational drug use.',
            'surf rock': 'Surf rock is a genre of rock music that originated in the United States in the early 1960s, characterized by its reverb-drenched guitar sounds, catchy melodies, and rhythmic drive, inspired by surfing culture.',
            'symphonic metal': 'Symphonic metal is a subgenre of heavy metal music that emerged in the 1990s, characterized by its use of symphonic orchestration and classical music elements, combined with heavy guitar riffs and operatic vocals.',
            'synth-pop': 'Synth-pop is a genre of popular music that emerged in the late 1970s, characterized by its use of synthesizers, electronic beats, and catchy melodies, often with a danceable rhythm.',
            'trance': 'Trance music is a genre of electronic dance music that originated in Germany in the early 1990s, characterized by its hypnotic beats, repetitive melodies, and uplifting atmosphere, often associated with all-night dance parties called raves.',
            'tribal': 'Tribal music is a genre of music that is rooted in the traditional music of indigenous cultures, often characterized by its rhythmic complexity, vocal chants, and use of indigenous instruments.',
            'trip hop': 'Trip hop is a genre of electronic music that emerged in the early 1990s, characterized by its downtempo beats, atmospheric textures, and use of sampled vocals and jazz influences.',
            'vaporwave': 'Vaporwave is a genre of electronic music that emerged in the early 2010s, characterized by its heavy use of sampling, chopped and screwed production techniques, and nostalgic aesthetic, often associated with internet culture and consumerism.',
            'world music': 'World music is a genre of music that encompasses a wide range of musical styles and traditions from around the world, often incorporating elements of folk music, traditional instrumentation, and cultural influences.',
            'zouk': 'Zouk music is a genre of music that originated in the French Caribbean islands of Guadeloupe and Martinique in the late 1970s, characterized by its infectious rhythms, sensual melodies, and vibrant instrumentation.',
            'zydeco': 'Zydeco music is a genre of American roots music that originated in the Creole communities of southwest Louisiana in the mid-20th century, characterized by its upbeat tempo, accordion-driven sound, and infectious groove.',
            // Add descriptions for the new genres here...
        };
        return descriptions[genre.toLowerCase()] || 'Description not available for this genre.';
    }

    function displaySearchResults(data) {
        var searchResults = $('#search-results');
        searchResults.empty(); // Clear previous search results
        
        // Append search results to the designated area on the page
        var title = data[1][0];
        var message = "Click the link above to learn more!";
        var url = data[3][0];
        var resultItem = '<div class="result-item"><h3 class="has-text-light"><a href="' + url + '" target="_blank">' + title + '</a></h3><p class="has-text-light">' + message + '</p></div>';
        searchResults.append(resultItem);
    }
});