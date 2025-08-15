# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Maven wrapper and the project definition file
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Copy the rest of your application's source code
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Specify the command to run on startup
CMD ["java", "-jar", "target/library-0.0.1-SNAPSHOT.jar"]