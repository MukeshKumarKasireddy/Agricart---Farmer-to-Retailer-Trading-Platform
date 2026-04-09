# Use Java 17
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the jar
CMD ["java", "-jar", "target/*.jar"]