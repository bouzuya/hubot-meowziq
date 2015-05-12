# Description
#   A Hubot script for meowziq
#
# Configuration:
#   HUBOT_MEOWZIQ_MEOWBOT
#   HUBOT_MEOWZIQ_ROOM
#   HUBOT_MEOWZIQ_URL
#
# Commands:
#   hubot [meowziq] play - play meowziq
#   hubot [meowziq] shuffle - shuffle meowziq
#   hubot [meowziq] skip - skip meowziq
#   hubot [meowziq] status - show meowziq status
#   hubot [meowziq] stop - stop meowziq
#
# Author:
#   bouzuya <m@bouzuya.net>
#
parseConfig = require 'hubot-config'
request = require 'request-b'

config = parseConfig 'meowziq',
  meowbot: null
  url: null
  room: null
  interval: '5000'

module.exports = (robot) ->
  if !config.url? or !config.room? or !config.interval
    robot.logger.warning 'hubot-meowziq: configuration error'
    return

  prefix = if config.meowbot then '' else 'meowziq '
  INTERVAL = parseInt config.interval, 10
  playing = null

  watch = (robot) ->
    setTimeout ->
      request config.url + '/status'
      .then (r) ->
        json = JSON.parse r.body
        song = json.song
        return unless song?
        return if playing is song.title
        playing = song.title
        message = "#{song.artist ? 'unknown'} - #{song.title ? 'unknown'}"
        robot.messageRoom config.room, message
      .then (-> watch robot), (-> watch robot)
    , INTERVAL

  pattern = new RegExp prefix + 'play'
  robot.respond pattern, (res) ->
    message = null
    request
      method: 'PATCH'
      url: config.url + '/status'
      form:
        text: 'play'
    .then (r) ->
      result = if r.statusCode is 200 then 'OK' else 'ERROR'
      res.send result

  pattern = new RegExp prefix + 'shuffle'
  robot.respond pattern, (res) ->
    request config.url + '/status'
    .then (r) ->
      json = JSON.parse r.body
      request
        method: 'PATCH'
        url: config.url + '/status'
        form:
          shuffle: !json.shuffle
    .then (r) ->
      result = if r.statusCode is 200 then 'OK' else 'ERROR'
      res.send result

  pattern = new RegExp prefix + 'skip'
  robot.respond pattern, (res) ->
    message = null
    request
      method: 'PATCH'
      url: config.url + '/status'
      form:
        text: 'skip'
    .then (r) ->
      result = if r.statusCode is 200 then 'OK' else 'ERROR'
      res.send result

  pattern = new RegExp prefix + 'status'
  robot.respond pattern, (res) ->
    message = null
    request config.url + '/status'
    .then (r) ->
      json = JSON.parse r.body
      message = """
        :scream_cat: meowziq :scream_cat:
        status  : #{json.text}
        shuffle : #{json.shuffle}
      """
      request config.url + '/songs'
    .then (r) ->
      json = JSON.parse r.body
      message += json.filter (_, index) ->
        index < 10
      .map (i, index) ->
        "\n[#{index}]: #{i.artist ? 'unknown'} - #{i.title ? 'unknown'}"
      .join ''
    .then ->
      res.send message

  pattern = new RegExp prefix + 'stop'
  robot.respond pattern, (res) ->
    message = null
    request
      method: 'PATCH'
      url: config.url + '/status'
      form:
        text: 'stop'
    .then (r) ->
      result = if r.statusCode is 200 then 'OK' else 'ERROR'
      res.send result

  watch robot
