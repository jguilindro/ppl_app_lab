
exports.seed = function(knex, Promise) {
  return knex('estudiantes').del()
    .then(function () {
      return knex('estudiantes').insert([
        {id: 1, nombres: 'EDISON', apellidos: 'MORA', correo: 'edmora@espol.edu.ec'}
      ]);
    });
};
