// MIGRACION
// npm run cross-env A=crear_profesores && npm run migrate
// knex migrate:latest
// knex migrate:rollback

// knex seed:run

// http://perkframework.com/v1/guides/database-migrations-knex.html
// https://gist.github.com/xiongjia/85df587ce3535d1c6151
// https://www.youtube.com/watch?v=R1f43FmHu7w&list=PL7sCSgsRZ-smPRSrim4bX5TQfRue1jKfw&index=6

var enviroment = process.env.NODE_ENV || 'development'
var config = require('./knexfile.js')[enviroment]
module.exports = require('knex')(config)