FROM node:24

WORKDIR /app

COPY backend-pazl/package*.json ./backend-pazl/
COPY frontend-pazl/package*.json ./frontend-pazl/

RUN cd backend-pazl && npm i
RUN cd frontend-pazl && npm i

COPY . .

WORKDIR /app/frontend-pazl
RUN npm run build

WORKDIR /app/backend-pazl

EXPOSE 3001
CMD ["node", "app.js"]
