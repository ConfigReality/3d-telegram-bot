FROM node:20 as builder

# Set the working directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

RUN npm install -g typescript

# Copy the source code
COPY . .

# Run the build
RUN npm run build

FROM node:20-slim
ENV NODE_ENV production
USER node
WORKDIR /home/node/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/server.js"]