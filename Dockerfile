#Dockerfile

# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:lts-alpine as builder
# Set the working directory to /app inside the container
RUN mkdir /app-ui
WORKDIR /app-ui

COPY package.json .

COPY package-lock.json .

# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
RUN npm run build




FROM nginx:alpine

# copy the .conf template
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page and replace it with the static files we created in the first step
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app-ui/build /usr/share/nginx/html
EXPOSE 8000

CMD nginx -g 'daemon off;'





#expose the port on which the app will be running (3000 is the default that `serve` uses)


#EXPOSE 8000
# Start the app
#CMD [ "npm", start"]

