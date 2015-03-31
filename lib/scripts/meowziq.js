// Description
//   A Hubot script for meowziq
//
// Configuration:
//   HUBOT_MEOWZIQ_URL
//   HUBOT_MEOWZIQ_ROOM
//
// Commands:
//   hubot meowziq play - play meowziq
//   hubot meowziq skip - skip meowziq
//   hubot meowziq status - show meowziq status
//   hubot meowziq stop - stop meowziq
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var config, parseConfig, request;

parseConfig = require('hubot-config');

request = require('request-b');

config = parseConfig('meowziq', {
  url: null,
  room: null,
  interval: '5000'
});

module.exports = function(robot) {
  var INTERVAL, playing, watch;
  if ((config.url == null) || (config.room == null) || !config.interval) {
    robot.logger.warning('hubot-meowziq: configuration error');
    return;
  }
  INTERVAL = parseInt(config.interval, 10);
  playing = null;
  watch = function(robot) {
    return setTimeout(function() {
      return request(config.url + '/songs').then(function(r) {
        var json, message, ref, ref1, song;
        json = JSON.parse(r.body);
        song = json[0];
        if (song == null) {
          return;
        }
        if (playing === song.title) {
          return;
        }
        playing = song.title;
        message = ((ref = song.artist) != null ? ref : 'unknown') + " - " + ((ref1 = song.title) != null ? ref1 : 'unknown');
        return robot.messageRoom(config.room, message);
      }).then((function() {
        return watch(robot);
      }), (function() {
        return watch(robot);
      }));
    }, INTERVAL);
  };
  robot.respond(/meowziq play/, function(res) {
    var message;
    message = null;
    return request({
      method: 'PATCH',
      url: config.url + '/status',
      form: {
        text: 'play'
      }
    }).then(function(r) {
      var result;
      result = r.statusCode === 200 ? 'OK' : 'ERROR';
      return res.send(result);
    });
  });
  robot.respond(/meowziq skip/, function(res) {
    var message;
    message = null;
    return request({
      method: 'PATCH',
      url: config.url + '/status',
      form: {
        text: 'skip'
      }
    }).then(function(r) {
      var result;
      result = r.statusCode === 200 ? 'OK' : 'ERROR';
      return res.send(result);
    });
  });
  robot.respond(/meowziq status/, function(res) {
    var message;
    message = null;
    return request(config.url + '/status').then(function(r) {
      var json;
      json = JSON.parse(r.body);
      message = ":scream_cat: meowziq :scream_cat: status is " + json.text;
      return request(config.url + '/songs');
    }).then(function(r) {
      var json;
      json = JSON.parse(r.body);
      return message += json.filter(function(_, index) {
        return index < 10;
      }).map(function(i, index) {
        var ref, ref1;
        return "\n[" + index + "]: " + ((ref = i.artist) != null ? ref : 'unknown') + " - " + ((ref1 = i.title) != null ? ref1 : 'unknown');
      }).join('');
    }).then(function() {
      return res.send(message);
    });
  });
  robot.respond(/meowziq stop/, function(res) {
    var message;
    message = null;
    return request({
      method: 'PATCH',
      url: config.url + '/status',
      form: {
        text: 'stop'
      }
    }).then(function(r) {
      var result;
      result = r.statusCode === 200 ? 'OK' : 'ERROR';
      return res.send(result);
    });
  });
  return watch(robot);
};
