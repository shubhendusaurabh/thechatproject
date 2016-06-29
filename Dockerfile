FROM node:latest

RUN npm install gulp-cli -g

RUN mkdir /src
WORKDIR /src

COPY package.json /src/

RUN npm install
COPY . /src/