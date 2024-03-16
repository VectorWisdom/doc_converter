FROM node:18

# Install LibreOffice
RUN apt-get update && apt-get install -y libreoffice

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Ensure directories exist and have correct permissions
RUN mkdir -p ./uploads ./converted && chmod 777 ./uploads ./converted

# Install app dependencies
COPY package.json ./
RUN pnpm install

# Bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "server.js" ]
