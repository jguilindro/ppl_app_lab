FROM centos:7
MAINTAINER Joel Rodriguez

WORKDIR /home/app
COPY .  /home/app

RUN yum -y update; yum clean all
RUN yum -y install epel-release; yum clean all
RUN yum -y install nodejs npm make gcc-c++; yum clean all
RUN cd /home/app; npm install
EXPOSE 8000
ENV NODE_ENV=development
## mongodb
EXPOSE 27017
