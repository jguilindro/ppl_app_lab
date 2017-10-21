
exports.seed = function(knex, Promise) {
  return knex('admin').del()
    .then(function () {
      return knex('admin').insert([
        {id: 1, nombres: 'BOSCO', apellidos: 'ANDRADE', correo: 'bosco@espol.edu.ec'}
      ]);
    });
};
