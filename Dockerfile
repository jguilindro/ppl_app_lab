FROM node:6.11.1
MAINTAINER Joel Rodriguez

WORKDIR /home/app
COPY .  /home/app
RUN npm install

EXPOSE 8000
ENV NODE_ENV=development
## mongodb
EXPOSE 27017