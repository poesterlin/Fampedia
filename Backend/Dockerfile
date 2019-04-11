FROM node:10.15.3-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./

RUN npm install --quiet

# Bundle app source
COPY . .

EXPOSE 3000

CMD npm run server