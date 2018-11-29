#!/usr/bin/env node
"use strict";

var https = require('https'); // Node HTTPS library
var _     = require('lodash') // Lodash library
var entityEnum = require('./entities.json')
var countryEnum = require('./countries.json')

module.exports = function search(entity, country, searchParams) {
  return new Promise(
    function (resolve, reject) {

      var basePath = 'https://itunes.apple.com'
      var kind = (_.isEmpty(entityEnum[entity])) ? 'tvSeason' : entityEnum[entity]
      var store = (_.isEmpty(countryEnum[country])) ? 'us' : countryEnum[country]

      var uri = ""
      if (kind == 'shortFilm') {
        uri = basePath + '/search?term=' + encodeURIComponent(searchParams) + '&country=' + store + '&entity=movie&attribute=shortFilmTer&limit=25'
      } else if (kind == 'id' || kind == 'idAlbum') {
        uri = basePath + '/lookup?id=' + encodeURIComponent(searchParams) + '&country=' + store + '&limit=25'
      } else {
        uri = basePath + '/search?term=' + encodeURIComponent(searchParams) + '&country=' + store + '&entity=' + kind + '&limit=25'
      }

      https.get(uri, (resp) => {
        let data = ''

        // A chunk of data has been received.
        resp.on('data', (chunk) => {
          data += chunk
        });

        // the entire response has been received
        resp.on('end', () => {
          var jsonData = JSON.parse(data)
          resolve(
            _.flatMap(jsonData, function(results) {
              return _.map(results, function(result) {
                return {
                  type: result.wrapperType,
                  artist_id: result.artistId,
                  collection_id: result.collectionId,
                  artist_name: result.artistName,
                  collection_name: result.collectionName,
                  img_tiny: result.artworkUrl60,
                  img_small: result.artworkUrl100,
                  img_medium: _.replace(result.artworkUrl100, '100x100', '600x600'),
                  img_large: _.replace(result.artworkUrl100, '100x100bb', '100000x100000-999')
                }
              })
            })
          )
        })
      }).on("error", (err) => {
        reject("Error: " + err.message)
      })
    }
  )
}

/*
search('audiobook', 'australia', 'ready player one').then(function(data) {
  console.log(data)
}).catch(function(error) {
  console.log(error)
})
*/
