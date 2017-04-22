echo "Copiando backup a mlab"

if [ -d "$DIRECTORY_PPL"]; then
  mongorestore -h ds049476.mlab.com:49476 -d ppl -u ppl -p ppl /home/joelerll/pasantias/dump/complete/ppl
  mongorestore -h ds049476.mlab.com:49476 -d ppl -u ppl -p ppl  /home/joelerll/pasantias/dump/sessions/ppl/sessions.bson
fi
