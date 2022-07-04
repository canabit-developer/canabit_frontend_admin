# Sets a language.
FROM node:14.18.2-alpine

# Sets environment variables.
ENV HOST="0.0.0.0"
ENV LANG="C.UTF-8"
ENV APP_ROOT="/var/www/cashback-admin-client"

# Configures environments.
WORKDIR $APP_ROOT 

COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run serve

# этап сборки (build stage) 
RUN npm run build

# этап production (production-stage) 
EXPOSE 3001
CMD ["npm", "run", "deploy"]
