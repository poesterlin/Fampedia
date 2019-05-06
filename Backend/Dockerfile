FROM node:10.15-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json fullchain.pem privkey.pem ./

RUN npm install --quiet

# Bundle app source
COPY ./src .

EXPOSE 3000

<<<<<<< HEAD
CMD ls && /bin/sh -c "sleep 10 && node app.js"
=======
CMD ls && /bin/sh -c "sleep 10 && node app.js"
>>>>>>> 10c1c42544e10bd5ebd93f589e9470ae2dd92131
