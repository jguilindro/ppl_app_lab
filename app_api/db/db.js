// MIGRACION
// npm run cross-env A=crear_profesores && npm run migrate
// knex migrate:latest
// knex migrate:rollback


//     "migrate": "cross-env NODE_ENV=development env-cmd .env_v2  knex migrate:make $A --knexfile  app_api_v2/db/knexfile.js",
//     "migrate:rollback": "cross-env NODE_ENV=development env-cmd .env_v2  knex migrate:rollback --knexfile  app_api/db/development/knexfile.js",
//     "migrate:latest": "cross-env NODE_ENV=development env-cmd .env_v2  knex migrate:latest --knexfile  app_api/db/development/knexfile.js",
//     "seed:run": "cross-env NODE_ENV=development env-cmd .env_v2  knex seed:run --knexfile  app_api_v2/db/development/knexfile.js",
//     "seed": "cross-env NODE_ENV=development env-cmd .env_v2  knex seed:make $A --knexfile  app_api_v2/db/knexfile.js",

// knex seed:run

// http://perkframework.com/v1/guides/database-migrations-knex.html
// https://gist.github.com/xiongjia/85df587ce3535d1c6151
// https://www.youtube.com/watch?v=R1f43FmHu7w&list=PL7sCSgsRZ-smPRSrim4bX5TQfRue1jKfw&index=6

var enviroment = process.env.NODE_ENV || 'development'
var config = require('./knexfile.js')[enviroment]
module.exports = require('knex')(config)
/*
var conn = {
  host     : '127.0.0.1',
  user     : 'user',
  password : 'pass',
  charset  : 'utf8'
};

// connect without database selected
var knex = require('knex')({ client: 'mysql', connection: conn});

knex.raw('CREATE DATABASE my_database')
  .then(function(){
    knex.destroy();
    
    // connect with database selected
    conn.database = 'my_database';
    knex = require('knex')({ client: 'mysql', connection: conn});

    knex.schema.createTable('my_table', function (table) {
      table.string('my_field');
    })
    .then(function() {
      knex.destroy();
    });
  });

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: 'postgres',
    charset: 'utf8'
  }
});

knex.raw('CREATE DATABASE DB_NAME;')
  .then(function() {
    return knex.raw('DROP DATABASE DB_NAME;')
  })
  .finally(function () {
    console.log("Done");
  });
*/

/*
process.on("exit", function() {
  console.log("My life ends!")
  process.nextTick(function() { console.log("FML") })
})
var knex = require('knex')(config)
knex.close()
knex.disconnect()
*/