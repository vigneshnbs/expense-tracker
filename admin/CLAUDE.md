# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Spring Boot 3.5.4 application for expense tracking administration, built with Java 21 and Maven. It uses Spring Data JPA with MySQL for data persistence, Spring Web for REST APIs, and Spring Boot Actuator for monitoring.

## Build and Run Commands

### Building the Application
```bash
./mvnw clean package
```

### Running the Application
```bash
./mvnw spring-boot:run
```

Or run the compiled JAR:
```bash
java -jar target/expensetracker-0.0.1-SNAPSHOT.jar
```

### Running with Docker
```bash
docker build -t expense-tracker-admin .
docker run -p 8080:8080 expense-tracker-admin
```

### Compiling Without Tests
```bash
./mvnw clean package -DskipTests
```

## Technology Stack

- **Java**: Version 21
- **Spring Boot**: 3.5.4
- **Database**: MySQL (with mysql-connector-j)
- **ORM**: Spring Data JPA
- **Build Tool**: Maven with wrapper (`mvnw`)
- **Annotations**: Lombok for boilerplate reduction
- **Monitoring**: Spring Boot Actuator

## Project Structure

- **Main Application**: `src/main/java/com/example/expensetracker/ExpensetrackerApplication.java`
- **Configuration**: `src/main/resources/application.properties`
- **Package Base**: `com.example.expensetracker`

## Important Configuration Notes

### Lombok Configuration
The project uses Lombok for reducing boilerplate code. The Maven compiler plugin is configured with annotation processor paths for Lombok (pom.xml:62-69). When adding entities or DTOs, use Lombok annotations like `@Data`, `@Entity`, `@Getter`, `@Setter`, etc.

### Database Configuration
The application expects MySQL connectivity. Database configuration should be added to `application.properties` with properties like:
- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`
- `spring.jpa.hibernate.ddl-auto`

### Default Port
The application runs on port 8080 by default (configured in Dockerfile:15).

## Development Workflow

1. Use `./mvnw` (Maven wrapper) instead of `mvn` to ensure consistent Maven version
2. The project follows standard Spring Boot package structure under `com.example.expensetracker`
3. Static resources go in `src/main/resources/static`
4. Templates go in `src/main/resources/templates`