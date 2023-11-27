# Use an official Node.js base image
FROM node:14

# Set the working directory to /app
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Use a non-root user to run the application
USER node

# Command to start the application
CMD ["npm", "start"]

