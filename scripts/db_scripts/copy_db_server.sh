#!/bin/bash

ssh -T manager@200.10.147.242 <<EOI
cd mongodump/
DATE=`date +%y-%m-%d_%H_%M_%S`
echo $DATE
EOI
#FOLDER=`cat tmp` \
#echo $FOLDER  
#echo `cat tmp`
#mongodump --db ppl --out $FOLDER 
#sleep 2
#echo "buscado"
#echo $DATE
#tar czf $DATE.tar.gz $DATE
# DATE=`date +%y-%m-%d_%H_%M_%S`
# echo "Haciendo el backup"
# FOLDER="/home/manager/mongodump/${DATE}"
# echo $FOLDER
# mongodump --db ppl -o $FOLDER
#echo $DATE > tmp



# SERVER="200.10.147.242"
# # SSH User name
# USR="manager"
# OUT="out.txt"
# ssh -t -t -l $USR $SERVER w > $OUT
# spawn ssh manager@200.10.147.242
# expect "password:"
# sleep 1
# send "<your password>\r"
# command1
# command2
# commandN

# ftp -n <<EOF
# open ftp.example.com
# user user secret
# put my-local-file.txt
# EOF