import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema({
  maxFileSize: { type: Number, default: 10485760 },
  allowedFormats: [{ type: String, default: 'image/jpeg' }],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('SystemConfig', systemConfigSchema);
