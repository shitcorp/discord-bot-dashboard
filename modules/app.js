/***
 * @fileOverview The back-end module which is running express.js
 */

const express = require('express')
const app = express()

// Util modules
const chalk = require('chalk')
const log = console.log

// TODO: Check for security measure which need to be done before
// TODO: express-session
// TODO: better frontend lmao
// TODO: Add routing system

// Run
exports.run = (client, port=3000) => {

  // (only-read) Basic information about the bot
  const botInfo = {
    username: client.user.username,
    status: client.user.presence.status,
    users: client.users.size,
    guilds: client.guilds.size
  }

  /*
  * App setup
  */

  // App view
  app.set('view engine', 'pug')
  app.set('views', './src/views')

  // Asset directories
  app.use('/static', express.static('./src/dist'))
  app.use('/static', express.static('./src/plugins'))
  /*
  * Routing
  */

  // Index page
  app.get('/', (req, res) => {
    res.render('index', {botInfo: botInfo})
  })

  // Listener
  app.listen(port, () => {
    log('INFO >> ' + chalk.green('Dashboard is running on port ' + port))
  })
}
