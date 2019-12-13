FROM node:11
LABEL maintainer="Fiksu codecontrol.fi"

COPY package.json /src/package.json
RUN cd /src && npm install --loglevel error
RUN npm install -g serve
RUN apt-get update
COPY . /src
WORKDIR /src
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait
EXPOSE 4001
RUN npm run build
CMD serve -s build -l 4001