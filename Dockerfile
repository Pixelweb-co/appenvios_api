############################################################
# Dockerfile para configurar aplicación en node.js - Express
############################################################

# Establece la imagen base
FROM node:14.5.0-alpine

# Información de Metadata
LABEL "apienvios.appNode"="PIXELWEB API AGILENVIO"
LABEL maintainer="admin@pixelweb.com.co"
LABEL version="1.0"


# Crear directorio de trabajo
RUN mkdir -p /home/ubuntu/apienvios

# Se estable el directorio de trabajo
WORKDIR /home/ubuntu/apienvios

# Copiar los archivos del proyecto a la imagen
COPY package*.json ./
COPY . .

# Instalar las dependencias
RUN npm install

# Exponer el puerto de la aplicación
EXPOSE 4000

# Establecer la variable de entorno para la conexión a la base de datos
ENV MONGO_URI mongodb://agilenvio:16287318@51.222.12.243:27017/envios

# Iniciar la aplicación
CMD ["npm", "start"]