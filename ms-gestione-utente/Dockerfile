FROM openjdk:8-jdk-alpine

ENV urlDB=""
ENV passwordDB=""
ENV usernameDB=""
ENV awsAppId=""
ENV awsPinpointAccessKey=""
ENV awsPinpointSecretKey=""
ENV awsEmailMittente=""
ENV awsS3UtenteAccessKey=""
ENV awsS3UtenteSecretKey=""
ENV awsS3UtenteBucketName=""

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT java -jar /app.jar --DB_PASSWORD=${passwordDB} --DB_URL=${urlDB} --DB_USERNAME=${usernameDB} --AWS.APP-ID=${awsAppId} --AWS.PINPOINT.ACCESS-KEY=${awsPinpointAccessKey} --AWS.PINPOINT.SECRET-KEY=${awsPinpointSecretKey} --AWS.EMAIL.MITTENTE=${awsEmailMittente} --AWS.S3.ACCESS-KEY=${awsS3UtenteAccessKey} --AWS.S3.BUCKET-NAME=${awsS3UtenteBucketName} --AWS.S3.SECRET-KEY=${awsS3UtenteSecretKey}
