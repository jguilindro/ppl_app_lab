<template id="tomar-leccion">
    <h1>profesiresdddsd</h1>
</template>

<script>
// https://github.com/louischatriot/nedb
//https://github.com/pubkey/rxdb
//https://developers.google.com/web/progressive-web-apps/
  // import low from 'lowdb'
  // import LocalStorage from 'lowdb/adapters/LocalStorage'
  //  var adapter = new LocalStorage('db')
  // var db = low(adapter)
  // db.set('user.name', 'typicode')
  // .write()
 //
  import Nedb from 'nedb'
  var db = new Nedb({
    filename: 'preguntas',
    autoload: true
  });

  db.insert({ planet: 'Earth' }, function (err) {
   db.find({}, function (err, docs) {
     // docs contains the two planets Earth and Mars
     console.log(docs)
   });
  });
</script>