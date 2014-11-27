var request = require('request');
var cheerio = require('cheerio');

var happy =  ['love','loved','like','liked','awesome','amazing','good','great','excellent'];
var sad = ['hate','hated','dislike','disliked','awful','terrible','bad','painful','worst'] ;
function arrayToTrueHash(arr) {
    var hash = {};
    arr.forEach(function(val) {
        hash[val] = true;
    });
    return hash;
}
var happyHash = arrayToTrueHash(happy),
    sadHash = arrayToTrueHash(sad);

function stringSentiment(str) {
    var words = str.split(' ');
    var happyCount = 0, sadCount = 0;
    words.forEach(function(word) {
        if (happyHash[word]) {
            ++happyCount;
        }
        else if (sadHash[word]) {
            ++sadCount;
        }
    });
    return {
        happy: happyCount,
        sad: sadCount,
    };
}

function overallSentiment(strs) {
    var happyStrCount = 0,
        sadStrCount = 0,
        happyWordCount = 0,
        sadWordCount = 0;
    var sentiment;
    strs.forEach(function(str) {
        sentiment = stringSentiment(str);
        happyWordCount += sentiment.happy;
        sadWordCount += sentiment.sad;
        if (sentiment.happy > sentiment.sad) {
             ++happyStrCount;
        }
        else if (sentiment.happy < sentiment.sad) {
            ++sadStrCount;
        }
    });
    var out = {
        happyWords: happyWordCount,
        sadWords: sadWordCount,
        happyStrings: happyStrCount,
        sadStrings: sadStrCount,
        totalStrings: strs.length,
    };
    //TODO format output as sentence
    console.log(out);
}

function getYoutubeComments(url, cb) {
    console.log('Getting comments for', url);
    request('https://plus.googleapis.com/u/0/_/widget/render/comments?first_party_property=YOUTUBE&href='+url, function(err, res, body) {
        if (err) { throw err; }
        var $ = cheerio.load(body);
        var strs = $('.Ct').map(function(i, el) {
            return $(el).text();
        }).get();
        cb (strs);
    });
}

var result = getYoutubeComments('https://www.youtube.com/watch?v=dQw4w9WgXcQ', overallSentiment);
