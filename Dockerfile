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

# Instala los paquetes existentes en el package.json
COPY package.json .
RUN npm install --quiet

# Instalación de Nodemon en forma Global
# Al realizarse cambios reiniciar el servidor
RUN npm install nodemon -g --quiet

# Copia la Aplicación
COPY . .

# Expone la aplicación en el puerto 8000
EXPOSE 8000

# Inicia la aplicación al iniciar al contenedor
CMD nodemon -L --watch . app.js