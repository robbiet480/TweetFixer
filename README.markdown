# TweetFixer
## Description
TweetFixer will keep an eye on your Twitter account and when it sees a URL, it will delete the tweet and replace it with a custom short url from your bit.ly account or a [YOURLS](http://yourls.org/) shortener (along with the existing tweet text). It will also drill down any short links it finds until it reaches the root URL, courtesy of [longurl.org](http://longurl.org). All of this takes place within 1 second, so most people won't ever notice a thing.

## Purpose
I got tired of not having better analytics on the links I was sending out on Twitter and, in some cases, generating money for other people because they used a shortener which had ads. Bit.ly's free account and YOURLS both provide pretty good analytics on links.

## Requirements
* [ntwitter](https://github.com/AvianFlu/ntwitter)
* [node-bitly](https://github.com/tanepiper/node-bitly)
* [colors.js](https://github.com/marak/colors.js)

## Setup
* Make a new file named config.json in the root directory.
* Put this in there:

```json
    settings = {
        "useragent": "tweetfixer/0.0.2 by Robbie Trencheny <http://github.com/robbiet480/tweetfixer>",
        "shortener": "yourls",
        "twitter": {
            "consumer_key": "",
            "consumer_secret": "",
            "access\_token_key": "",
            "access\_token_secret": "",
            "user_id": "46713",
            "source": "<a href=\"Domain.com\" rel=\"nofollow\">App Name</a>"
        },
        "bitly": {
            "username": "",
            "api\_key": ""
        },
        "yourls": {
            "username":"",
            "password":"",
            "domain":""
        }
    }
```
* Change the values to suit your needs. For shortener, the valid values are yourls or bitly
* Save config.json in the root directory
* Run `node app.js`

## Notes
You need to setup a new application on your Twitter account. To do this, go to [dev.twitter.com](http://dev.twitter.com), sign in and [create a new app](https://dev.twitter.com/apps/new). Name it whatever you want (preferably something without apostrophes etc). Make sure you change the permissions model to read AND write. Then go back to the main app page and at the bottom click generate access details to get the access\_token\_key and access\_token\_secret. All the keys and secrets go into the config.json file

## Acknowledgements
* Ankur Oberoi for the function/callback help

## Running
`node app.js`

## Version History
0.0.2: Separate settings file, YOURLS support.
0.0.1: Initial release. bit.ly support only

## Contributing
Fork it, change it, pull request it