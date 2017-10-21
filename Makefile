#install nodejs(rvm), mongodb(de binario), redis-cli(de binario), mongoose, sqlelectron
install:
	apt-get install mysql-server

mongo:
	cd /home/joelerll/extras/mongodb-linux-x86_64-3.2.11/bin && ./mongod --dbpath /home/joelerll/pasantias/dump

test:
	yarn test

docs:
	yarn docs

.PHONY: mongo install