# DIRECTORY=/home/joelerll/pasantias/dump/sessions/ppl
# DIRECTORY_PPL=/home/joelerll/pasantias/dump/complete/ppl
# echo "Eliminando carpeta si existe"
# if [ -d "$DIRECTORY" ]; then
#   rm -r  /home/joelerll/pasantias/dump/sessions
# fi
# echo "Descargando las sessiones"
# mongodump -h ds049476.mlab.com:49476 -d ppl -c sessions -u ppl -p ppl -o /home/joelerll/pasantias/dump/sessions
DATE=`date +%d-%m-%y_%H:%M:%S`
echo "Haciendo el backup"
FOLDER="/home/joelerll/pasantias/dump/IMPORTANTE/${DATE}"
echo $FOLDER
mongodump -h ds127801.mlab.com:27801 -d ppl-production -u ppl -p ppl -o $FOLDER
