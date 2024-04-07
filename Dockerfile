FROM ubuntu:latest
LABEL authors="Akshar Patel"

FROM gradle:jdk17-jammy AS build
COPY --chown=gradle:gradle . /basic-real-time-chat
WORKDIR /basic-real-time-chat
RUN gradle fatJar --no-daemon

FROM eclipse-temurin:17-jdk-jammy
COPY --from=build /basic-real-time-chat/build/libs/basic-real-time-chat.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]