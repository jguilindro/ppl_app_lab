
exports.seed = function(knex, Promise) {
  return knex('profesores').del()
    .then(function () {
      return knex('profesores').insert([
        {id: 1, nombres: 'JOEL EDUARDO', apellidos: 'RODRIGUEZ LLAMUCA', correo: 'joeedrod@espol.edu.ec'}
      ]);
    });
};