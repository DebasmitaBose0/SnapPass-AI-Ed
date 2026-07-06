import SystemConfig from '../models/systemConfig.model.js';

export async function getConfig(req, res) {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
      await config.save();
    }
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
