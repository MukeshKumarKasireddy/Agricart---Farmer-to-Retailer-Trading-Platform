FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy project
COPY . .

# Move to correct folder (IMPORTANT)
WORKDIR /app/farmer

# Install Maven + build
RUN apt-get update && apt-get install -y maven \
    && mvn clean package -DskipTests

# Debug: show files (optional but useful)
RUN ls -l target

# Run jar safely
CMD ["sh", "-c", "java -jar target/*.jar"]