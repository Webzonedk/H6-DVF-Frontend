# Byggestage
FROM node:lts-alpine as build-step

WORKDIR /app

# Rens npm cache for at undgå potentielle konflikter
RUN npm cache clean --force

# Kopier alle filer til arbejdsområdet
COPY . .

# Installer afhængigheder og byg projektet
RUN npm install
RUN npm run build --prod

# Server stage med Nginx
FROM nginx:alpine

# Kopier de byggede filer fra Angular-byggestadiet til den korrekte Nginx-mappe
COPY --from=build-step /app/dist/dvf-frontend/browser /usr/share/nginx/html

# Kopier nginx konfigurationsfilen til standard nginx konfigurationsmappe
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Eksponér port 8083 til omverdenen
EXPOSE 8083

CMD ["nginx", "-g", "daemon off;"]
