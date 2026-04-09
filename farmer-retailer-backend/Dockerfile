FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

# Move into correct folder where pom.xml exists
WORKDIR /app/farmer

# Install Maven and build
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

# Run app
CMD ["java", "-jar", "target/*.jar"]