FROM node:20-alpine

WORKDIR /app

# نسخ جميع الملفات
COPY . .

# تثبيت الحزم
RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]