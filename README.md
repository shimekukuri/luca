## Luca Take home

## Table of Contents

- [About](#about)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About

This project was produced for a take home exercise. The project is built with Docker, Python, Flask, Pytorch, Vite, React.

## Getting Started

To start the project clone the repo and tranverse the main directory and use docker compose up --build. It should fully build the project, on my M1 Mac it usually takes around 10 minutes to install all dependencies, and boot up the server running on localhost:5500. You should know the project is ready from when the command line emits this message: "spawned uWSGI master process (pid: 1)", there are also pre built docker images available.

### Prerequisites

Docker

### Installation

clone the repo, go to the main directory and input the command docker compose up --build. Usually takes around 10 minutes to build on modern hardware.

### Usage

After starting the docker process in your browser navigate to localhost:5500 from there you will be able to interact with a chat window with AI generated responses. You can also view a history of the conversation in the logs section of the website stored on the mysql server

## Contributing

No contributions will be accepted for this project

## License

MIT lincense
