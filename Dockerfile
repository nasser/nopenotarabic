FROM node:alpine as build
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN node ssg.js build

FROM nginx:alpine
COPY --from=build /build/out /usr/share/nginx/html 