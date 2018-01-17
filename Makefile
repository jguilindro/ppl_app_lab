#install nodejs(rvm), mongodb(de binario), redis-cli(de binario), mongoose, sqlelectron
install:
	apt-get install mysql-server

mongo:
	mongod --dbpath ~/.extras/mongodb/data

test:
	yarn test

redis:
	cd ~/extras/redis-3.2.7/src && ./redis-server

redis-cli:
	cd ~/extras/redis-3.2.7/src && ./redis-cli

docs:
	yarn docs

test-docs:
	yarn test:integration REPORTER=doc \
		| cat docs/head.html - docs/tail.html \
		> docs/test.html

.PHONY: mongo install