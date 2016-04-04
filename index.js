var request = require('request')
var Promise = require('bluebird')
var _       = require('underscore')

var getGallery
var options

(function() {
  var defaults
  defaults = {
    cover:                'cover',
    imageLinks:           'photos',
    title:                'title',
    description:          'exerpt',
    // galleryTemplate:   'themes/myGalleryTemplate.ejs'
    galleryTemplate:      'node_modules/hexo-imgur/templates/basic.ejs'
    // images:            'images',
    // clientId:          'set yours in _config.yml'
  }
  options = _.extend(
    {},
    defaults,
    hexo.config.imgur
  )
  // get rid of falsy options, this allows you to override defaults
  options = _.pick(options, function(option) {
    return option
  })
})()

getGallery = function(imgurGalleryKey) {
  return new Promise(function(resolve, reject) {
    request.get(
      {
        url: 'https://api.imgur.com/3/album/' + imgurGalleryKey,
        headers: {
          'Authorization': 'Client-ID ' + options.clientId
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
  })
  .then(function(imgurData) {
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

    return imgurData
  })
}

hexo.extend.filter.register('before_post_render', function(hexoPost) {
  if (!hexoPost.imgurGalleryKey) {
    return Promise.resolve(hexoPost)
  }

  return getGallery(hexoPost.imgurGalleryKey)
  .then(function(imgurData) {

    // attach specified keys to post, omit `clientId` key
    _.each(_.omit(options, 'clientId'), function(hexoKey, imgurKey) {
      hexoPost[hexoKey] = imgurData[imgurKey]
    })

    return hexoPost
  })
});

hexo.extend.tag.register('imgur', function(imgurGalleryKey, content){
  return getGallery(imgurGalleryKey)
  .then(function(imgurData) {
    return hexo.render.render(
      {
        path: options.galleryTemplate
      },
      imgurData
    )
  })
}, {async: true})
