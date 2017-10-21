
exports.up = function(knex, Promise) {
  return knex.schema.createTable('profesores', function(table) {
    table.increments()
    table.string('nombres').notNullable()
    table.string('apellidos').notNullable()
    table.string('correo').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('profesores')
};
