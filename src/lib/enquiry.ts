/**
 * The enquiry form's contract with the existing Cloudflare Worker
 * (kavriqon-enquiries). Same endpoint, same JSON keys and the same
 * `{success: true}` reply as the live site on `main` — only the UI changed.
 * The recipient address and the Resend key stay server-side in the Worker.
 */
export const ENQUIRY_ENDPOINT = 'https://kavriqon-enquiries.dawarqay.workers.dev/submit';

export type EnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  /** Honeypot. Real people leave it empty; the Worker can drop anything that fills it. */
  website: string;
};

export async function sendEnquiry(payload: EnquiryPayload): Promise<void> {
  const response = await fetch(ENQUIRY_ENDPOINT, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as {success?: boolean; message?: string};
  if (!response.ok || result.success !== true) {
    throw new Error(result.message || 'The enquiry could not be sent.');
  }
}
