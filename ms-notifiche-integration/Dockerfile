FROM openjdk:8-jdk-alpine

ENV urlDB=""
ENV passwordDB=""
ENV usernameDB=""
ENV awsAppId=""
ENV awsPinpointAccessKey=""
ENV awsPinpointSecretKey=""
ENV awsEmailMittente=""
ENV awsWorkdocsAccessKey=""
ENV awsWorkdocsSecretKey=""
ENV awsWorkdocsOrganizationId=""
ENV rocketChatHost=""
ENV rocketChatBaseUri=""
ENV rocketChatClientAccessToken=""
ENV rocketChatClientUserId=""
ENV drupalEndpoint=""
ENV drupalAuthUsername=""
ENV drupalAuthPassword=""

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT java -jar /app.jar --DB_PASSWORD=${passwordDB} --DB_URL=${urlDB} --DB_USERNAME=${usernameDB} --AWS.WORKDOCS.ACCESS-KEY=${awsWorkdocsAccessKey} --AWS.WORKDOCS.SECRET-KEY=${awsWorkdocsSecretKey} --AWS.WORKDOCS.ORGANIZATION-ID=${awsWorkdocsOrganizationId} --ROCKET-CHAT.HOST=${rocketChatHost} --ROCKET-CHAT.BASE-URI=${rocketChatBaseUri} --ROCKET-CHAT.CLIENT.ACCESS-TOKEN=${rocketChatClientAccessToken} --ROCKET-CHAT.CLIENT.USER-ID=${rocketChatClientUserId} --DRUPAL.ENDPOINT=${drupalEndpoint} --DRUPAL.AUTH.USERNAME=${drupalAuthUsername} --DRUPAL.AUTH.PASSWORD=${drupalAuthPassword}
