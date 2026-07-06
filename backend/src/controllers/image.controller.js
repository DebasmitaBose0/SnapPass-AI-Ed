import { applyWatermark } from '../services/watermark.service.js';

export async function getPreviewImage(req, res) {
  try {
    const imageUrl = req.query.url;
    const watermarked = await applyWatermark(imageUrl);
    res.setHeader('Content-Type', 'image/jpeg');
    return res.send(watermarked);
  } catch (error) {
    return res.status(500).send('Error generating preview');
  }
}
