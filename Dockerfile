# Simple Dockerfile for Chat App
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000 3001
CMD ["npm", "start"]
