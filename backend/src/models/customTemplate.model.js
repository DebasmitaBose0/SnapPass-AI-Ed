import mongoose from 'mongoose';

const customTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
});

export default mongoose.model('CustomTemplate', customTemplateSchema);
