# Registry Microservice

This is the README file for the Registry Microservice project.

## Description

The Registry Microservice is a part of the larger microservices architecture for your Node.js backend. It serves as a registry service, allowing other microservices to register themselves and discover each other.

## Installation

To install and run the Registry Microservice, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/registry-service.git`
2. Navigate to the project directory: `cd registry-service`
3. Install the dependencies: `npm install`
4. Start the microservice: `npm start`

## Usage

To use the Registry Microservice, you can make HTTP requests to the provided endpoints. Here are some examples:

- Register/Re-register within a heartbeat interval a microservice:
  ```
  PUT /register/:serviceName/:serviceVersion/:servicePort
  ```

- Unregister a microservice:
  ```
  DELETE /register/:serviceName/:serviceVersion/:servicePort
  ```

- Get a microservice (Load balanced):
  ```
  GET /get/:serviceName/:serviceVersion
  ```
  `semver` is used here so you can pass 1 for 1.0.0, 1.0.1, ..., 2 for 2.0.0, 2.0.1, ..., or direct version number of the service or * for any version.

## License

This project is licensed under the [ISC License](LICENSE).
