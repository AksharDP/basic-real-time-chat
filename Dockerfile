FROM ubuntu:latest
LABEL authors="Akshar Patel"

FROM gradle:jdk17-jammy AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle fatJar --no-daemon

FROM eclipse-temurin:17-jdk-jammy
COPY --from=build /home/build/libs/basic-real-time-chat.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]