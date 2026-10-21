# Etapa 1: construir (aquí hay herramientas de desarrollo)
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: imagen final (solo lo necesario para ejecutar)
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
ENV PORT=3002
EXPOSE 3002
USER node
CMD ["node", "dist/main.js"]