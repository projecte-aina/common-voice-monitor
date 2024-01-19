
# commonvoice-monitor

Fetch data from common voice and save it to a database for later analysis


## Prerequisites

Make

[Docker](https://docs.docker.com/engine/install/ubuntu/)

[Docker compose](https://docs.docker.com/compose/install/)

- Google spreadsheet credential file (service account) as private-key.json


## Environment Variables

To run this project, you will need to add the following environment variables to your production.env file

`MONGO_URI`

Example of .env file

```bash
LOCALE=ca
GOOGLE_SHEETS_DOCUMENT_ID=YOUR_DOCUMENT_ID
FIRST_WEEK_DATE=2022-02-15T00:00:00.000Z
MONGO_URI=mongodb://EXAMPLE_USER:EXAMPLE_PASSWORD@YOUR_HOST:27017/DATABASE_NAME?authSource=admin
```


## Installation

Install commonvoice-monitor

## Run Locally

Clone the project

```bash
git clone https://github.com/projecte-aina/common-voice-monitor
```

Go to the project directory

```bash
cd common-voice-monitor
```

Install dependencies

```bash
yarn install
```

Start the server

```bash
yarn start
```

## Deployment (docker compose)

To deploy this project run

```bash
make deploy
```

## Authors

- [@PaulNdrei](https://github.com/PaulNdrei)
- [@gullabi](https://github.com/gullabi)



