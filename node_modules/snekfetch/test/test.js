const snekfetch = require('../index');
// const fs = require('fs');

// snekfetch.get('https://s.gus.host/o-SNAKES.jpg').pipe(fs.createWriteStream('out.jpg'));
// snekfetch.get('https://discordapp.com/assets/b9411af07f154a6fef543e7e442e4da9.mp3')
//   .pipe(fs.createWriteStream('ring.mp3'));

snekfetch.get('https://httpbin.org/redirect/1')
  .set('X-Boop-Me', 'Dream plz')
  .query({ a: 1, b: 2 })
  .query('c', 3)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .then(() => console.log('test 1 success'));

snekfetch.post('http://strawpoll.me/api/v2/polls')
  .send({ title: 'snekfetch', options: ['1', '2'] })
  .then(() => console.log('test 2 success'));
