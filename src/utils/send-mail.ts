import path from 'node:path';
import nodemailer from 'nodemailer';
import { RequestBody } from '../schemas/input';

export type SendMailOptions = RequestBody;

export async function sendMail(options: SendMailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: `"${options.name}" <${process.env.GMAIL_USER}>`,
    to: options.to ?? process.env.EMAIL_FALLBACK_RECEIVER,
    replyTo: `${options.name} <${options.replyTo}>`,
    subject: options.subject ?? 'Gcloud Mail Service',
    text: options.text,
    html: options.html,
    attachments: options.attachments?.map((attachment) => ({
      filename: path.basename(new URL(attachment).pathname),
      path: attachment,
    })),
  });
  return info;
}
