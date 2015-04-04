# hubot-meowziq

A Hubot script for meowziq

## Installation

    $ npm install https://github.com/bouzuya/hubot-meowziq/archive/master.tar.gz

or

    $ npm install https://github.com/bouzuya/hubot-meowziq/archive/{VERSION}.tar.gz

## Example

    bouzuya> hubot help meowziq
      hubot> hubot [meowziq] play - play meowziq
             hubot [meowziq] skip - skip meowziq
             hubot [meowziq] status - show meowziq status
             hubot [meowziq] stop - stop meowziq

    bouzuya> hubot meowziq play
      hubot> OK

    bouzuya> hubot meowziq skip
      hubot> OK

    bouzuya> hubot meowziq stop
      hubot> OK

    bouzuya> hubot meowziq status
      hubot> :scream_cat: meowziq :scream_cat: status is play
             [0]: 和田光司 - Butter-Fly
             [1]: THE IDOLM@STER - 自分REST@RT

## Configuration

See [`src/scripts/meowziq.coffee`](src/scripts/meowziq.coffee).

## Development

See `npm run`

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

## Badges

[![Build Status][travis-badge]][travis]
[![Dependencies status][david-dm-badge]][david-dm]
[![Coverage Status][coveralls-badge]][coveralls]

[travis]: https://travis-ci.org/bouzuya/hubot-meowziq
[travis-badge]: https://travis-ci.org/bouzuya/hubot-meowziq.svg?branch=master
[david-dm]: https://david-dm.org/bouzuya/hubot-meowziq
[david-dm-badge]: https://david-dm.org/bouzuya/hubot-meowziq.png
[coveralls]: https://coveralls.io/r/bouzuya/hubot-meowziq
[coveralls-badge]: https://img.shields.io/coveralls/bouzuya/hubot-meowziq.svg
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
