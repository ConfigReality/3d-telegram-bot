FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Build app

COPY . .

RUN npm run build

# Exec app

CMD [ "npm", "start" ]