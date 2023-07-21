#### Stage 1: Build the application
FROM openjdk:8-jdk-alpine as build

# Set the current working directory inside the image
WORKDIR /app

# Copy the gradle wrapper and its properties file to the image
COPY gradlew .
COPY gradle gradle

# Copy the build.gradle file
COPY build.gradle .

# Download all the dependencies in preparation to go offline. 
# This is a separate step so the dependencies will be cached unless 
# the build.gradle file has changed.
RUN ./gradlew dependencies

# Copy the project source
COPY src src

# Build the application
RUN ./gradlew build -x test
RUN mkdir -p build/dependency && (cd build/dependency; jar -xf ../libs/*.jar)

#### Stage 2: A minimal docker image with command to run the app 
FROM openjdk:8-jre-alpine

ARG DEPENDENCY=/app/build/dependency

# Copy project dependencies from the build stage
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app

ENTRYPOINT ["java","-cp","app:app/lib/*","com.example.polls.PollsApplication"]
