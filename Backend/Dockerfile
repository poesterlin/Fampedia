FROM node:10.15-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json fullchain.pem privkey.pem ./

RUN npm install --quiet

COPY ./src ./src
COPY ./test ./test

EXPOSE 3000

CMD cd ./src && ls && /bin/sh -c "sleep 10 && node app.js"
