FROM node:20-alpine as build
# Set the working directory to /app
WORKDIR /usr/app
# Copy the package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code to the container
COPY . .
# Build the React app
RUN npm run build
# Use an official Nginx runtime as a parent image
FROM nginx:latest
# Copy the ngnix.conf to the container
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Copy the React app build files to the container
COPY --from=build /usr/app/dist /usr/share/nginx/html
# Expose port 80 for Nginx
EXPOSE 80
# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
