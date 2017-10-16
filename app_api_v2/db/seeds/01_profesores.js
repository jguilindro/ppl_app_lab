
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('profesores').del()
    .then(function () {
      // Inserts seed entries
      return knex('profesores').insert([
        {id: 1, nombres: 'JOEL EDUARDO', apellidos: 'RODRIGUEZ LLAMUCA', correo: 'joeedrod@espol.edu.ec'}
      ]);
    });
};
