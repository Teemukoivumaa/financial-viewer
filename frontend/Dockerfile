FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package* ./

RUN npm ci && npm install

COPY . .

# CMD ["npm", "start"]

CMD [ "npm", "run", "start.dev" ]