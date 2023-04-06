FROM node
EXPOSE 3000
COPY . . 
WORKDIR /
RUN command npm install
CMD ["node","server.js" ]