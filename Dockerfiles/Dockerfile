FROM node:8.1.2

COPY ./ /src

WORKDIR /src

RUN npm install -g yarn
RUN yarn install

RUN ls ./typings ./
RUN yarn run build

CMD ["yarn", "start"]
