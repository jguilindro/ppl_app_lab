DIRECTORY=/home/joelerll/pasantias/dump/sessions/ppl
DIRECTORY_PPL=/home/joelerll/pasantias/dump/complete/ppl
echo "Eliminando carpeta si existe"
if [ -d "$DIRECTORY" ]; then
  rm -r  /home/joelerll/pasantias/dump/sessions
fi
echo "Descargando las sessiones"
mongodump -h ds049476.mlab.com:49476 -d ppl -c sessions -u ppl -p ppl -o /home/joelerll/pasantias/dump/sessions
