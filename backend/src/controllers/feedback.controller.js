import Feedback from '../models/feedback.model.js';

export async function submitFeedback(req, res) {
  try {
    const { rating, comment } = req.body;
    const feedback = new Feedback({ rating, comment });
    await feedback.save();
    return res.status(201).json({ success: true, feedback });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
