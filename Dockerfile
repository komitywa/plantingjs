FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /root

RUN \
    apt-get update && \
    apt-get install -y wget python gcc build-essential git && \
    wget https://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz && \
    tar -xzf node-v0.12.7.tar.gz

WORKDIR /root/node-v0.12.7

RUN \
    ./configure && \
    make && \
    make install

WORKDIR /root

RUN \
    rm -rf node*

ADD . /root/plantingjs

WORKDIR /root

RUN cd plantingjs && \
    npm install -g gulp
RUN cd plantingjs && \
    npm install -g bower
RUN cd plantingjs && \
    npm install && \
    mv node_modules ..
RUN cd plantingjs && \
    bower install --allow-root --config.interactive=false && \
    mv bower_components ..

WORKDIR /root/plantingjs

EXPOSE 9000
EXPOSE 35729

CMD npm run server
