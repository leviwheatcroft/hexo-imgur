## hexo-filter-imgur

Hexo filter to populate post variables from imgur gallery. This plugin does not
simply load an iframe, but allows you to format and style the gallery according
to your hexo theme.

### usage

First install ala:

    npm install hexo-filter-imgur --save

You'll need an imgur key:

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

Then configure your _config.yml per below

then add `imgurAlbumKey` in the front matter for any post you want to show as
an album.

After that the filter will be run automatically when you `hexo generate`

### configuration

firstly you need to include the clientId you got from imgur in your _config.yml
like so:

```
imgur:
  clientId: e5230f612bb2a1d
```

in addition, you can list which fields you want to populate in your hexo post
with which fields from the imgur album.


## external references

[1]: https://api.imgur.com/oauth2/addclient imgur register
