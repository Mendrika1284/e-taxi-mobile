# Dockerfile pour l'application mobile (e-taxi-mobile)
# Note : Pour Expo/React Native, on utilise souvent l'image node pour builder, mais l'app mobile n'est pas destinée à tourner dans un conteneur en prod. Ce Dockerfile sert surtout pour le build/test.
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install
COPY . .
CMD ["npm", "start"]
