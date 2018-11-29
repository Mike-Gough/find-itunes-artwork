var searchForiTunesArtwork = require('./');

searchForiTunesArtwork('audiobook', 'australia', 'ready player one').then(function(data) {
  console.log(data)
}).catch(function(error) {
  console.log(error)
})
