FROM openjdk:8-jdk-alpine

ENV urlDB=""
ENV passwordDB=""
ENV usernameDB=""
ENV awsAppId=""
ENV awsPinpointAccessKey=""
ENV awsPinpointSecretKey=""
ENV awsS3AccessKey=""
ENV awsS3BucketName=""
ENV awsS3SecretKey=""
ENV MONGODB_HOST=""
ENV MONGODB_NAME=""
ENV MONGODB_PORT=""
ENV DB_MONGO_USERNAME=""
ENV DB_MONGO_PASSWORD=""

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT java -jar /app.jar --DB_PASSWORD=${passwordDB} --DB_URL=${urlDB} --DB_USERNAME=${usernameDB} --AWS.APP-ID=${awsAppId} --AWS.PINPOINT.ACCESS-KEY=${awsPinpointAccessKey} --AWS.PINPOINT.SECRET-KEY=${awsPinpointSecretKey} --AWS.S3.ACCESS-KEY=${awsS3AccessKey} --AWS.S3.BUCKET-NAME=${awsS3BucketName} --AWS.S3.SECRET-KEY=${awsS3SecretKey} --MONGODB_HOST=${MONGODB_HOST} --MONGODB_NAME=${MONGODB_NAME} --MONGODB_PORT=${MONGODB_PORT} --DB_MONGO_USERNAME=${DB_MONGO_USERNAME} --DB_MONGO_PASSWORD=${DB_MONGO_PASSWORD}
