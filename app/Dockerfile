FROM node:18

WORKDIR /usr/local/src
COPY package.json yarn.lock .

RUN yarn

CMD ["yarn", "start"]