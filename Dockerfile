# Establecer la imagen base
FROM node:latest


RUN mkdir -p /home/pixelweb/nodejs/app/node_modules && chown -R node:node /home/pixelweb/nodejs/app

# Establecer el directorio de trabajo en la imagen
WORKDIR /home/pixelweb/nodejs/app

# Copiar los archivos del proyecto a la imagen
COPY package*.json ./
COPY . .

# Instalar las dependencias
RUN npm install

# Exponer el puerto de la aplicación
EXPOSE 2042

# Establecer la variable de entorno para la conexión a la base de datos
ENV MONGO_URI mongodb://agilenvio:16287318@51.222.12.243:27017/envios

# Iniciar la aplicación
CMD ["npm", "start"]
