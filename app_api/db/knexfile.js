module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : process.env.DATABASE_DEVELOPMENT_DATABASE
    },
    migrations: {
      directory: __dirname + '/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host : process.env.DATABASE_PRODUCTION_HOST,
      user : process.env.DATABASE_PRODUCTION_USER,
      password : process.env.DATABASE_PRODUCTION_PASSWORD,
      database : process.env.DATABASE_PRODUCTION_DATABASE
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: __dirname + '/seeds/production'
    }
  },
  testing: {
    client: 'mysql',
    connection: {
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : process.env.DATABASE_TESTING_DATABASE
    },
    migrations: {
      directory: __dirname + '/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/testing'
    }
  }
}
