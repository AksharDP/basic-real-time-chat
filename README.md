A basic real time chat app using springboot and websockets. I am using render.com for the example website. It will take ~50 seconds for the website to start from cold if no one has visited it in a while.

***
## Installation
Default port is 8080
### Docker
```
git clone https://github.com/AksharDP/basic-real-time-chat.git
cd basic-real-time-chat
docker build -t basic-real-time-chat .
docker run -d -p 8080:8080 basic-real-time-chat
```
### Java Jar
```
git clone https://github.com/AksharDP/basic-real-time-chat.git
cd basic-real-time-chat
gradle bootJar
cd build/libs
java -jar basic-real-time-chat.jar
```
Change gradle to `.\gradlew` if you are using windows