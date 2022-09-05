FROM openjdk:8-jdk-alpine

ENV urlDB=""
ENV passwordDB=""
ENV usernameDB=""
ENV awsAppId=""
ENV awsPinpointAccessKey=""
ENV awsPinpointSecretKey=""
ENV MONGODB_HOST=""
ENV MONGODB_NAME=""
ENV MONGODB_PORT=""
ENV DB_MONGO_USERNAME=""
ENV DB_MONGO_PASSWORD=""
ENV awsEmailMittente=""

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT java -jar /app.jar --DB_PASSWORD=${passwordDB} --DB_URL=${urlDB} --DB_USERNAME=${usernameDB} --AWS.APP-ID=${awsAppId} --AWS.PINPOINT.ACCESS-KEY=${awsPinpointAccessKey} --AWS.PINPOINT.SECRET-KEY=${awsPinpointSecretKey} --MONGODB_HOST=${MONGODB_HOST} --MONGODB_NAME=${MONGODB_NAME} --MONGODB_PORT=${MONGODB_PORT} --DB_MONGO_USERNAME=${DB_MONGO_USERNAME} --DB_MONGO_PASSWORD=${DB_MONGO_PASSWORD} --AWS.EMAIL.MITTENTE=${awsEmailMittente}
