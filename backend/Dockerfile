FROM node:24

WORKDIR /backend-express

COPY package*.json ./

RUN yarn config set network-timeout 3000000
RUN yarn install

COPY . .

CMD [ "yarn","start"]
