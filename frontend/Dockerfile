# Stage 1: Build the React Application
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# We set the API URL for the build process
# NOTE: In a real production setup, this usually happens at runtime, 
# but for this assignment, baking it in is fine.
ARG VITE_API_URL=http://127.0.0.1:8000/api/
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built assets from Stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]