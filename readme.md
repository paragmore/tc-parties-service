# Fastify based node js microservice

## Using dependency injection with inversify.js
    Bind the classes to inject with the container in inversify.config.ts

## ApiHelper:
    Can be used to send the specific fixed response to client
    Use the APIHelper .get /put /post /delete sattic methods, and the types need to be added for the params /body and query strings expected from user
    Has static methods such as success / callfailed / missingparameters