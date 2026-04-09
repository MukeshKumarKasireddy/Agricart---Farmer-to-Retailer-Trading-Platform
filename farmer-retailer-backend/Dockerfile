FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# Install Maven and build
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

CMD ["java", "-jar", "target/*.jar"]