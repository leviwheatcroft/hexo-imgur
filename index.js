var request = require('request')
var Promise = require('bluebird')
var _       = require('underscore')

var defaults = {
  cover:          'cover',
  imageLinks:     'photos',
  title:          'title',
  description:    'exerpt',
  // images:         'images',
  // clientId:       'set yours in _config.yml'
}

getGallery = function(clientId, galleryId) {
  return new Promise(function(resolve, reject) {
    request.get(
      {
        url: 'https://api.imgur.com/3/album/' + galleryId,
        headers: {
          'Authorization': 'Client-ID ' + clientId
        }
      },
      function (err, req, body) {
        if (err) {
          reject(error);
          return;
        }
        resolve(body);
      }
    )
  })
}

hexo.extend.filter.register('before_post_render', function(hexoPost) {
  if (!hexoPost.imgurGalleryKey) {
    return Promise.resolve(hexoPost)
  }
  var options
  options = _.extend(
    {},
    defaults,
    hexo.config.imgur
  )
  // get rid of falsy options, this allows you to override defaults
  options = _.pick(options, function(option) {
    return option
  })
  return getGallery(options.clientId, hexoPost.imgurGalleryKey)
  .then(function(imgurData) {
    return new Promise(function(resolve, reject) {
      // parse
      imgurData = JSON.parse(imgurData).data
      // check for api error
      if (_.has(imgurData, 'error')) {
        hexo.log.error("Imgur: " + imgurData.error)
        reject()
      } else {
        resolve(imgurData)
      }
    })
  }).then(function(imgurData) {

    // create array of links suitable for `post.photos`
    imgurData.imageLinks = _.map(imgurData.images, function(image) {
      return image.link
    })
    // convert album datetime to human readable
    imgurData.datetime = new Date(imgurData.datetime * 1000).toLocaleString()
    // convert image datetimes to human readable
    _.each(imgurData.images, function(image) {
      image.datetime = new Date(image.datetime * 1000).toLocaleString()
    })
    // find link for cover image
    imgurData.cover = _.find(imgurData.images, function(image) {
      return image.id == imgurData.cover
    }).link
    // attach specified keys to post, omit `clientId` key
    _.each(_.omit(options, 'clientId'), function(hexoKey, imgurKey) {
      hexoPost[hexoKey] = imgurData[imgurKey]
    })
    console.log(hexoPost)
    return hexoPost

  })
});

