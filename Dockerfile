FROM node:latest

RUN npm install bower gulp-cli nodemon -g

RUN mkdir /src
WORKDIR /src

COPY package.json /src/
RUN . /src/