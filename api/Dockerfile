FROM node:18

WORKDIR /usr/local/src
COPY package.json yarn.lock .

RUN yarn
RUN yarn global add nodemon sequelize-cli

CMD ["sh", "startup.sh"]