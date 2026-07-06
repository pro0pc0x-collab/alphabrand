FROM node:20-alpine

WORKDIR /app

# نسخ ملفات package.json
COPY package*.json ./
RUN npm install

# نسخ جميع الملفات (بما في ذلك frontend)
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]