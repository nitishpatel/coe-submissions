FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm ci --silent

COPY . .

ENV PORT=5173
EXPOSE 5173

CMD ["npm", "run", "dev"]
