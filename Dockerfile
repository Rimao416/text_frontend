# Utilise une image Node.js légère
FROM node:latest

# Définit le répertoire de travail
WORKDIR /app

# Copie uniquement package.json et yarn.lock pour optimiser le cache Docker
COPY package.json yarn.lock ./

# Installe les dépendances
RUN yarn install

# Copie le reste du projet
COPY . .

# Expose le port Next.js
EXPOSE 3000

# Commande pour démarrer Next.js en mode développement
CMD ["yarn", "dev"]
