var twitter = require('ntwitter')
    ,Bitly = require('Bitly').Bitly
    ,http = require('http')
    ,sys = require('sys')

var bitly = new Bitly('USERNAME', 'API KEY');

var twit = new twitter({
    consumer_key: 'CONSUMER KEY',
    consumer_secret: 'CONSUMER SECRET',
    access_token_key: 'ACCESS TOKEN KEY',
    access_token_secret: 'ACCESS TOKEN SECRET'
});

var new_url;
var new_json;
var data;
var chunk;
var final_url = '';

function unshorten(url1, cb) {
    request = http.request({
        host: 'api.longurl.org',
        port: 80,
        path: "/v2/expand?format=json&url=" + escape(url1),
        method: 'GET',
        headers: {
            'User-Agent': 'tweetfixer/1.0'
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

function FixURL(str, id) {
    var url_match = new RegExp(/https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?/);
    if (!url_match.exec(str)) {
        return false;
    } else {
        / / check string
    var string = url_match.exec(str);
    unshorten(string[0],
    function(url) {
        var final_url = url;
        console.log(final_url);
        bitly.shorten(final_url,
        function(result) {
            var new_tweet = string['input'].replace(string[0], result.data.url);
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
twit.stream('statuses/filter', {
    'follow': 'TWITTER USER ID'
},
function(stream) {
    stream.on('data',
    function(data) {
        //console.log(data);
        var text = data.text;
        var id = data.id_str;
        var source = data.source;
        if (source !== '<a href="YOUR DOMAIN" rel="nofollow">YOUR APP NAME</a>') {
            var url = FixURL(text, id);
        } else {
            console.log('Not tweeting, since I would cause a loop!');
        }

    });
});

