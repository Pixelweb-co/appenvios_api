FROM node:16-alpine


WORKDIR /home/pixelweb/nodejs/appenvios_api

COPY package.json /home/pixelweb/nodejs/appenvios_api

RUN npm install

COPY . /home/pixelweb/nodejs/appenvios_api

CMD ["node", "index2.js"]