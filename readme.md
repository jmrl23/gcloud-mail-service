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
   git clone <repository-url>
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
  --runtime=nodejs20 \
  --region=YOUR_REGION \
  --source=. \
  --entry-point=main \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars API_KEY=YOUR_KEY,GMAIL_USER=YOUR_EMAIL,GMAIL_PASS=YOUR_PASS,EMAIL_FALLBACK_RECEIVER=YOUR_FALLBACK
```

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

```bash
curl -X POST https://REGION-PROJECT_ID.cloudfunctions.net/email-sender/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-api-key" \
  -d '{
    "name": "John Doe",
    "replyTo": "john.doe@example.com",
    "subject": "Hello from API",
    "text": "This is a test email sent via the Personal Email Sender API.",
    "to": ["recipient@example.com"]
  }'
```

## Response

**Status:** `200 OK`

```json
{
  "data": {
    "accepted": ["recipient@example.com"],
    "rejected": [],
    "envelopeTime": 123,
    "messageTime": 456,
    "messageSize": 789,
    "response": "250 2.0.0 OK",
    "envelope": {
      "from": "sender@example.com",
      "to": ["recipient@example.com"]
    },
    "messageId": "<...>"
  }
}
```
