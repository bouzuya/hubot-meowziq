// Description
//   A Hubot script for meowziq
//
// Configuration:
//   HUBOT_MEOWZIQ_MEOWBOT
//   HUBOT_MEOWZIQ_ROOM
//   HUBOT_MEOWZIQ_URL
//
// Commands:
//   hubot [meowziq] play - play meowziq
//   hubot [meowziq] shuffle - shuffle meowziq
//   hubot [meowziq] skip - skip meowziq
//   hubot [meowziq] status - show meowziq status
//   hubot [meowziq] stop - stop meowziq
//
// Author:
//   bouzuya <m@bouzuya.net>
//
var config, parseConfig, request;

parseConfig = require('hubot-config');

request = require('request-b');

config = parseConfig('meowziq', {
  meowbot: null,
  url: null,
  room: null,
  interval: '5000'
});

module.exports = function(robot) {
  var INTERVAL, pattern, playing, prefix, watch;
  if ((config.url == null) || (config.room == null) || !config.interval) {
    robot.logger.warning('hubot-meowziq: configuration error');
    return;
  }
  prefix = config.meowbot ? '' : 'meowziq ';
  INTERVAL = parseInt(config.interval, 10);
  playing = null;
  watch = function(robot) {
    return setTimeout(function() {
      return request(config.url + '/status').then(function(r) {
        var json, message, ref, ref1, song;
        json = JSON.parse(r.body);
        song = json.song;
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
  pattern = new RegExp(prefix + 'play');
  robot.respond(pattern, function(res) {
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
  pattern = new RegExp(prefix + 'shuffle');
  robot.respond(pattern, function(res) {
    return request(config.url + '/status').then(function(r) {
      var json;
      json = JSON.parse(r.body);
      return request({
        method: 'PATCH',
        url: config.url + '/status',
        form: {
          shuffle: !json.shuffle
        }
      });
    }).then(function(r) {
      var result;
      result = r.statusCode === 200 ? 'OK' : 'ERROR';
      return res.send(result);
    });
  });
  pattern = new RegExp(prefix + 'skip');
  robot.respond(pattern, function(res) {
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
  pattern = new RegExp(prefix + 'status');
  robot.respond(pattern, function(res) {
    var message;
    message = null;
    return request(config.url + '/status').then(function(r) {
      var json;
      json = JSON.parse(r.body);
      message = ":scream_cat: meowziq :scream_cat:\nstatus  : " + json.text + "\nshuffle : " + json.shuffle;
      return request(config.url + '/songs');
    }).then(function(r) {
      var json;
      json = JSON.parse(r.body);
      message += json.filter(function(_, index) {
        return index < 10;
      }).map(function(i, index) {
        var ref, ref1;
        return "\n[" + index + "]: " + ((ref = i.artist) != null ? ref : 'unknown') + " - " + ((ref1 = i.title) != null ? ref1 : 'unknown');
      }).join('');
      if (json.length > 10) {
        return message += '\n...';
      }
    }).then(function() {
      return res.send(message);
    });
  });
  pattern = new RegExp(prefix + 'stop');
  robot.respond(pattern, function(res) {
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
