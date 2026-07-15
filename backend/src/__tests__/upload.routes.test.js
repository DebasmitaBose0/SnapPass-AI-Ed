import request from 'supertest';
import app from '../app.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testUploadDir = path.resolve(__dirname, '..', '..', 'test_uploads');
const fixtureDir = path.resolve(__dirname, 'fixtures');

beforeAll(() => {
  if (!fs.existsSync(testUploadDir)) fs.mkdirSync(testUploadDir, { recursive: true });
  if (!fs.existsSync(fixtureDir)) fs.mkdirSync(fixtureDir, { recursive: true });
  process.env.UPLOAD_DIR = testUploadDir;
});

afterAll(() => {
  if (fs.existsSync(testUploadDir)) fs.rmSync(testUploadDir, { recursive: true, force: true });
});

const createValidJpeg = () => {
  const buf = Buffer.alloc(1024);
  buf.write('\xff\xd8\xff\xe0', 0, 'binary');
  const filePath = path.join(fixtureDir, 'valid_test.jpg');
  fs.writeFileSync(filePath, buf);
  return filePath;
};

const createInvalidFile = () => {
  const filePath = path.join(fixtureDir, 'fake_image.txt');
  fs.writeFileSync(filePath, 'This is not an image file');
  return filePath;
};

describe('POST /api/upload', () => {
  it('should reject upload with no file', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.status).toBe(400);
  });

  it('should reject upload with invalid file type', async () => {
    const txtPath = createInvalidFile();
    const res = await request(app)
      .post('/api/upload')
      .attach('file', txtPath);
    expect(res.status).toBe(400);
  });

  it('should accept a valid file upload', async () => {
    const imgPath = createValidJpeg();
    const res = await request(app)
      .post('/api/upload')
      .attach('file', imgPath);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('filename');
  });
});

describe('POST /api/upload/batch', () => {
  it('should reject batch with invalid files', async () => {
    const txtPath = createInvalidFile();
    const res = await request(app)
      .post('/api/upload/batch')
      .attach('files', txtPath);
    expect(res.status).toBe(400);
  });
});
