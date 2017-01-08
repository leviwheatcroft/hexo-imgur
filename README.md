## hexo-imgur

Hexo filter and tag to populate post variables from imgur gallery. This plugin
does not simply load an iframe, but allows you to format and style the gallery
according to your hexo theme.

### Deprecated

Please open an issue if you would like to take ownership.

### installation

    npm install hexo-filter-imgur --save

### get your imgur client id

You'll need an imgur client id:

 * go to imgur [register an application][1] page.
 * Application Name: anything
 * Authorization type: anonymous usage
 * Authorization callback URL: blank
 * Application website: blank
 * email: your email
 * description: my hexo-filter-imgur api key

When I submitted this form (April 2016) there was some kind of server error..
and the form said I needed an auth callback url. I just submitted a second time
and it worked, so IDK.

### basic usage

First include your `clientId` in `_config.yml`.

```
imgur:
  clientId: e5230f612bb2a1d
```

Then insert the imgur tag in your post content:

```
{% imgur qUxdy3 %}
```

This will read the album with the key `qUxdy3` from imgur, and render it inline,
using `templates/basic.ejs`. Depending on what theme you're using, this may not
look that great. Post an issue here on github if your theme is broken when you
do this.

You can specify your own template if you like:

```
imgur:
  clientId: e5230f612bb2a1d
  galleryTemplate: themes/myAwesomeGallery.ejs
```

### advanced usage

This method gives you much more control over how the gallery is rendered, but
will require editing your theme

First configure your `_config.yml`, you need to map the imgur data (key name)
to fields in your hexo post (value), the config below includes some common
useful fields:

```
imgur:
  # clientId is a special case, not part of the map
  clientId: e5230f612bb2a1d
  # imgurKey: hexoKey
  title: title # default
  description: exerpt #default
  cover: cover # default
  imageLinks: photos # default
  datetime: datetime
  images: images
```

The `photos` field in hexo is commonly used by themes which expect it to
contain a simple array of urls, the `imageLinks` key provides exactly that.

The `images` key contains an array of objects which look like this:

```json
{
  "id": "CjmMMmM",
  "title": "Timber Beams",
  "description": "This is a timber beam",
  "datetime": "1 April 2016, 7:45 PM",
  "type": "image\/jpeg",
  "animated": false,
  "width": 3096,
  "height": 4128,
  "size": 1665684,
  "views": 853,
  "bandwidth": 1420828452,
  "vote": null,
  "favorite": false,
  "nsfw": null,
  "section": null,
  "account_url": null,
  "account_id": null,
  "comment_preview": null,
  "link": "http:\/\/i.imgur.com\/CjmMMmM.jpg"
}

```

You do not need to call the tag from your post as with "basic usage", just
set `imgurGalleryKey` in your front matter, and then your template will have
access to the fields you specified in your `_config.yml`.

After that the filter will be run automatically when you `hexo generate`

## external references

[1]: https://api.imgur.com/oauth2/addclient imgur register
