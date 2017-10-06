#!/bin/bash
mongobin=$HOME/extras/mongodb-linux-x86_64-3.2.11/bin/mongo
mongorestorebin=$HOME/extras/mongodb-linux-x86_64-3.2.11/bin/mongorestore
$mongobin ppl --eval "db.dropDatabase()"
echo "Borrando base de datos"
sleep 2
$mongorestorebin --db ppl /home/joelerll/pasantias/dump/inicio/ppl
echo "Terminado de restore base de datos"