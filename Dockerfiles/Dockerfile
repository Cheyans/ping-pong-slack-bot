FROM node:8.1.2

RUN npm install -g yarn

COPY ./package.json /src/package.json
COPY ./yarn.lock /src/yarn.lock
COPY ./tsconfig.json /src/tsconfig.json

RUN cd /src && yarn install

COPY . /src

WORKDIR /src

RUN yarn run build

CMD ["yarn", "start"]
