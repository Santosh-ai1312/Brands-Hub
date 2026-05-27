FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY . .

RUN mvn package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/brandshub-backend-1.0.0.jar"]