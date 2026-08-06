import axios from 'axios';
import { logger } from '../utils/logger.js';
import { signWebhookPayload } from '../utils/webhookSigner.utils.js';

export class WebhookService {
  /**
   * Triggers a webhook event and sends a payload to a target URL.
   * @param {string} url - Target URL
   * @param {string} event - Event name (e.g. 'image.processed')
   * @param {object} payload - Data payload
   * @param {string} [secret] - Optional webhook signing secret
   */
  static async trigger(url, event, payload, secret = '') {
    if (!url) return;
    try {
      logger.info(`Triggering webhook ${event} to ${url}`);
      const body = {
        event,
        timestamp: new Date().toISOString(),
        data: payload
      };
      const headers = {
        'Content-Type': 'application/json',
        'X-SnapPass-Event': event
      };
      if (secret) {
        headers['X-SnapPass-Signature'] = signWebhookPayload(body, secret);
      }
      await axios.post(url, body, { headers, timeout: 5000 });
    } catch (error) {
      logger.error(`Webhook delivery failed for event ${event}: ${error.message}`);
    }
  }
}

