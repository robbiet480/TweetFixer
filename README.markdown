# TweetFixer
## Description
TweetFixer will keep an eye on your Twitter account and when it finds a URL, it will replace it with a custom short url from your bit.ly account. It will also drill down any short links it finds until it reaches the root URL

## Purpose
I got tired of not having better analytics on the links I was sending out and, in some cases, generating money for other people because they used a shortener which had ads. Bit.ly's free account provides pretty good analytics on all links.

## Requirements
* [ntwitter](https://github.com/AvianFlu/ntwitter) MAKE SURE YOU GET ntwitter FROM THE GITHUB REPO. The one in NPM is broken right now, even though they have the same version
* [node-bitly](https://github.com/tanepiper/node-bitly)


## Setup
* Configure your Bit.ly username, and API on line 6. 
* Configure your consumer_key, consumer_secret, access\_token\_key and access\_token\_secret on lines 9-12. 
* On line 79, set your own user id.
* On line 88 change YOUR DOMAIN and YOUR APP NAME to whatever you used to sign up. Make sure it is exact. You can also get this by viewing the JSON for any tweet and copy/pasting the source child in here.

## Notes
You need to setup a new application on your Twitter account. To do this, go to [dev.twitter.com](http://dev.twitter.com), sign in and [create a new app](https://dev.twitter.com/apps/new). Name it whatever you want (preferably something without apostrophes etc). Make sure you change the permissions model to read AND write. Then go back to the main app page and at the bottom click generate access details to get the access\_token\_key and access\_token\_secret.

## Running
`node app.js`

## Contributing
Fork it, change it, pull request it