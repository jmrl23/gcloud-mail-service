# GCloud Mail Service Function

A Google Cloud Function that provides a secure HTTP API for sending emails using Gmail. Features include support for HTML content, file attachments, configurable reply-to addresses, and a fallback recipient system.

## Quickstart

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Yarn](https://yarnpkg.com/)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) (for deployment)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jmrl23/gcloud-mail-service.git
   cd mail-service
   ```

1. Install dependencies:

   ```bash
   yarn install
   ```

1. Configure environment variables:
   Copy the example environment file to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in your values:

   - `API_KEY`: A secure random string for authentication.
   - `GMAIL_USER`: Your Gmail address.
   - `GMAIL_PASS`: Your Gmail App Password (see [Google App Passwords](https://myaccount.google.com/apppasswords)).
   - `EMAIL_FALLBACK_RECEIVER`: Default email address to receive mails if `to` is not provided.

### Local Development

Start the function locally:

```bash
yarn dev
```

The function will be available at `http://localhost:8080`.

You can test it using curl:

```bash
curl -X POST http://localhost:8080/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: <YOUR_API_KEY>" \
  -d '{
    "name": "Test User",
    "replyTo": "test@example.com",
    "subject": "Local Test",
    "text": "Hello from localhost!"
  }'
```

### Deployment

Deploy to Google Cloud Functions:

```bash
gcloud functions deploy mail-service \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-east1 \
  --source=. \
  --entry-point=main \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars API_KEY=YOUR_KEY,GMAIL_USER=YOUR_EMAIL,GMAIL_PASS=YOUR_PASS,EMAIL_FALLBACK_RECEIVER=YOUR_FALLBACK
```

> **Note:** This project includes a `.vscode/launch.json` configuration for deploying via the [Google Cloud Code](https://cloud.google.com/code/docs/vscode/deploying-cloud-functions) extension.

## Authentication

This API requires an API key to be passed in the `x-api-key` header.

## Request

**Method:** `POST`
**Path:** `/send`

### Headers

| Header         | Value              | Description                 |
| :------------- | :----------------- | :-------------------------- |
| `Content-Type` | `application/json` | Required                    |
| `x-api-key`    | `<YOUR_API_KEY>`   | Required for authentication |

### Body Parameters

| Parameter     | Type               | Required | Description                                                                |
| :------------ | :----------------- | :------- | :------------------------------------------------------------------------- |
| `name`        | string             | **Yes**  | The name of the sender                                                     |
| `replyTo`     | string (email)     | **Yes**  | The email address to reply to                                              |
| `subject`     | string             | No       | The subject of the email                                                   |
| `text`        | string             | No       | The plain text content of the email                                        |
| `html`        | string             | No       | The HTML content of the email                                              |
| `to`          | string[] (email[]) | No       | List of recipient email addresses (Defaults to system fallback if omitted) |
| `attachments` | string[] (url[])   | No       | List of URLs to file attachments                                           |

## Sample Usage

Send a rich HTML welcome email:

```bash
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/mail-service/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "MyApp Team",
    "replyTo": "support@myapp.com",
    "to": ["new.user@example.com"],
    "subject": "Welcome to MyApp! 🚀",
    "text": "Hi there! Welcome to MyApp. We are thrilled to have you.",
    "html": "<div style=\"font-family: sans-serif; padding: 20px;\"><h1>Welcome to MyApp!</h1><p>We are <b>thrilled</b> to have you on board.</p><p>Click <a href=\"https://myapp.com\">here</a> to get started.</p></div>"
  }'
```

## Response

**Status:** `200 OK`

```json
{
  "data": {
    "accepted": ["new.user@example.com"],
    "rejected": [],
    "envelopeTime": 123,
    "messageTime": 456,
    "messageSize": 789,
    "response": "250 2.0.0 OK",
    "envelope": {
      "from": "sender@gmail.com",
      "to": ["new.user@example.com"]
    },
    "messageId": "<...>"
  }
}
```
