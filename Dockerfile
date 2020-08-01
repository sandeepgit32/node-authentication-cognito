FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port
EXPOSE 5000

# Start application
CMD [ "npm", "start" ]