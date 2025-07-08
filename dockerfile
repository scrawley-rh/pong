# Use nginx base image
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy your Pong game files to the nginx web root
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx (default command)
