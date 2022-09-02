FROM openjdk:8-jdk-alpine

ENV urlDB=""
ENV passwordDB=""
ENV usernameDB=""
ENV awsAppId=""
ENV awsPinpointAccessKey=""
ENV awsPinpointSecretKey=""
ENV awsEmailMittente=""

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT java -jar /app.jar --DB_PASSWORD=${passwordDB} --DB_URL=${urlDB} --DB_USERNAME=${usernameDB} --AWS.APP-ID=${awsAppId} --AWS.PINPOINT.ACCESS-KEY=${awsPinpointAccessKey} --AWS.PINPOINT.SECRET-KEY=${awsPinpointSecretKey} --AWS.EMAIL.MITTENTE=${awsEmailMittente}
