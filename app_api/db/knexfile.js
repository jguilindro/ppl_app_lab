module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : `ppl_${process.env.NODE_ENV}`
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
      host : process.env.DATABASE_HOST,
      user : process.env.DATABASE_USER,
      password : process.env.DATABASE_PASSWORD,
      database : `ppl_${process.env.NODE_ENV}`
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
      database : `ppl_${process.env.NODE_ENV}`
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
