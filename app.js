//TweetFixer 0.0.2
//requires
var twitter = require('ntwitter')
    ,http = require('http')
    ,color = require('colors')
    ,Bitly = require('bitly').Bitly
    ,fs = require('fs')
    ,sys = require('sys')
//Read in config file
var settings = eval(fs.readFileSync('config.json', encoding="ascii"));

//Setup Twitter
var twit = new twitter({
    consumer_key: settings.twitter.consumer_key,
    consumer_secret: settings.twitter.consumer_secret,
    access_token_key: settings.twitter.access_token_key,
    access_token_secret: settings.twitter.access_token_secret
});

//Ok! Script loaded
console.log(color.green(color.underline('TweetFixer 0.0.2, started')));

//Check if Bitly is enabled, if so, set it up!
if(settings.shortener == "bitly") {
    console.log(color.green(color.underline('Using bit.ly for the shortener')));
var bitly = new Bitly(settings.bitly.username, settings.bitly.api_key);
} else {
    console.log(color.green(color.underline('Using YOURLS for the shortener')));
}


//Set some variables
var new_url;
var new_json;
var data;
var chunk;
var final_url = '';

//determine which URL shortener to use
function pick_shortener(url1, cb) {
    if(settings.shortener == "yourls") {
        yourls_shorten(url1, function(result) {
           cb(result); 
        });
    } else if(settings.shortener == "bitly") {
        bitly.shorten(url1, function(result) {
            //console.log(result.data.url);
            cb(result.data.url);
        });


    }
}

//YOURLS shortener function
function yourls_shorten(url1, cb) {
    request = http.request({
        host: settings.yourls.domain,
        port: 80,
        path: '/yourls-api.php?username='+settings.yourls.username+'&password='+settings.yourls.password+'&action=shorturl&format=simple&url=' + escape(url1),
        method: 'GET',
        headers: {
            'User-Agent': settings.useragent
        }
    },
    function(response) {
        response.setEncoding('utf8');
        var responseData = '';
        response.on('data',
        function(chunk) {
            responseData += chunk;
        });
        response.on('end',
        function() {
            cb(responseData);
        });
    });
    request.end();
}

//Unshorten via longurl.org function
function unshorten(url1, cb) {
    request = http.request({
        host: 'api.longurl.org',
        port: 80,
        path: "/v2/expand?format=json&url=" + escape(url1),
        method: 'GET',
        headers: {
            'User-Agent': settings.useragent
        }
    },
    function(response) {
        response.setEncoding('utf8');
        var responseData = '';
        response.on('data',
        function(chunk) {
            responseData += chunk;
        });
        response.on('end',
        function() {
            new_json = responseData.replace('long-url', 'longurl');
            data = JSON.parse(new_json);
            new_url = data.longurl;
            cb(new_url);
        });
    });
    request.end();
}

//The brains of the script. Checks incoming tweets for URL's, if it exists, delete and tweet with our own URL
function FixURL(str, id) {
    var url_match = new RegExp(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/); // fragment locater
    if (!url_match.exec(str)) {
        console.log(color.red(color.underline('Skipping this:')) + ' '+str);
        return false;
    } else {
    var string = url_match.exec(str);
    unshorten(string[0],
    function(url) {
        var final_url = url;
        pick_shortener(final_url,
        function(result) {
            var new_tweet = string['input'].replace(string[0], result);
            console.log(color.yellow(color.underline('Original tweet:')) + ' '+str);
            console.log(color.red(color.underline('Deleting this:')) + ' '+id);
            console.log(color.blue(color.underline('Tweeting this:')) + ' '+new_tweet);
            twit.destroyStatus(id,
            function(err, data) {
                //console.log('destroyed: ' + console.dir(data))
                });
            twit.updateStatus(new_tweet,
            function(err, data) {
                //console.log('FixURL tweeted: ' + console.dir(data));
                }
            );
            return new_tweet;
        });
    });

}
}
//Start the Twitter stream
twit.stream('statuses/filter', {
    'follow': settings.twitter.user_id
},
function(stream) {
    stream.on('data',
    function(data) {
        //Uncomment below to show full data from Twitter stream
        //console.log(data);
        if(data.delete) {
            console.log(color.red(color.underline('Tweet deleted:')) + ' '+data.delete.status.id);
        } else {
        var text = data.text;
        var id = data.id_str;
        var source = data.source;
        if (source !== settings.twitter.source) {
            var url = FixURL(text, id);
        } else {
            console.log(color.red(color.underline('Not tweeting, since I would cause a loop!')));
            }
        }

    });
});