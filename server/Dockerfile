# Pull the base image with node
FROM node:16-alpine

# Set working directory in the Docker container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json .

# Install all dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose the port
EXPOSE 3001

# Run the app. Here we use serve to serve the build directory on port 3000.
CMD [ "node", "app.js"]


