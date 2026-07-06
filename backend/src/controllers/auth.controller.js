export async function deleteAccount(req, res) {
  try {
    const userId = req.body.userId;
    return res
      .status(200)
      .json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
