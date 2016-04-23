/*
This code is really messy. When I wrote it I wasn't ever planning on
other people seeing it. It was for personal use, and to some extent,
still is. I just thought it'd be fun to throw some scans up.
*/
var async = require('async');
var request = require('request');
var fs = require('fs');

var data = {};
var date_array = [];
var args = process.argv.slice(2);
var channel = args.join(' ');
var time = new Date();
var date = time.getDate().toString();
var month = time.getMonth() + 1;
var year = time.getFullYear().toString();
var c_date = month + '-' + date + '-' + year;

async.waterfall([
  
  function(callback) {
    var URL = 'http://tmi.twitch.tv/group/user/' + channel + '/chatters';
    request(URL, function(err, response, body) {
      if(!err && response.statusCode == 200) {
        var json = JSON.parse(body);
        var getViewers = json['chatters']['viewers'];
        data.total = getViewers.length;
        fs.writeFile(channel + c_date + '.json', 'Total:' + data.total, function(err) {
          if(err) return console.log(err);
          console.log('File created:' + channel + c_date);
        });
        for(var c = 0; c <= data.total; c++) {   //LOL C++ GET IT MOM?
          request('https://api.twitch.tv/kraken/users/' + getViewers[c], function(err, response, body) {
            if(!err && response.statusCode == 200) {
              var parsedBody = JSON.parse(body);
              var fetchDate = parsedBody['created_at'];
              var parsedDate = fetchDate.split('T')[0];
              fs.appendFile(channel + c_date + '.json', '\n' + parsedDate, function(err) {
                if(err) return console.log(err);
              })
            } else {
              console.log('Error on check #' + c + ' Status Code:' + response.statusCode);
            }
            callback(null, date_array);
          });
        }
      } else {
        console.log(response.statusCode + ' Error');
      }
    });
  }
],

function(err, date_array) {
  if(err) {
    console.log("well fuck man");
  }
  console.log('Done!');
});
