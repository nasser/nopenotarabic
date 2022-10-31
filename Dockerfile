FROM nginx:alpine
RUN apk add nodejs
RUN apk add npm
WORKDIR /app
COPY package* ./
COPY *.js ./
COPY *.yaml ./
COPY *.html ./
ADD media media
RUN npm install
RUN node ssg.js build --out /usr/share/nginx/html