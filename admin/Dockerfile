FROM eclipse-temurin:21-jdk-alpine

# Install Maven
RUN apk add --no-cache maven

WORKDIR /app

# Copy Maven build files first (for better caching)
COPY pom.xml ./
COPY src ./src

# Build the JAR
RUN mvn clean package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/expensetracker-0.0.1-SNAPSHOT.jar"]
