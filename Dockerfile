# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /mern-backend-blog

# Copy the application files into the working directory
COPY . /mern-backend-blog

# Install the application dependencies
RUN npm install

EXPOSE 4444

# Define the entry point for the container
CMD ["npm", "start"]