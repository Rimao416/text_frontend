# Étape 1 : Construire l'application
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers et construire l'application
COPY . .
RUN npm run build

# Étape 2 : Servir le build en production
FROM node:18-alpine
WORKDIR /app

# Copier les fichiers construits depuis l'étape précédente
COPY --from=builder /app ./

# Exposer le port de l'application
EXPOSE 3000

# Démarrer le serveur
CMD ["npm", "start"]
