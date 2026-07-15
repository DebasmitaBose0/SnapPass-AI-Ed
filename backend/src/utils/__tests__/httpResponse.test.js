import { successResponse, errorResponse, paginatedResponse } from '../httpResponse.js';

const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => { res.body = body; return res; };
  return res;
};

describe('successResponse', () => {
  it('returns 200 with data and default message', () => {
    const res = mockRes();
    successResponse(res, { id: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Success');
    expect(res.body.data).toEqual({ id: 1 });
  });

  it('uses provided status and message', () => {
    const res = mockRes();
    successResponse(res, null, 'Created', 201);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Created');
  });
});

describe('errorResponse', () => {
  it('returns 400 with error message by default', () => {
    const res = mockRes();
    errorResponse(res, 'Bad request');
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Bad request');
  });

  it('includes errors array when provided', () => {
    const res = mockRes();
    errorResponse(res, 'Validation failed', 422, ['Field is required']);
    expect(res.statusCode).toBe(422);
    expect(res.body.errors).toEqual(['Field is required']);
  });
});

describe('paginatedResponse', () => {
  it('returns paginated structure', () => {
    const res = mockRes();
    paginatedResponse(res, [1, 2], 50, 1, 10);
    expect(res.statusCode).toBe(200);
    expect(res.body.pagination.total).toBe(50);
    expect(res.body.pagination.page).toBe(1);
    expect(res.body.pagination.totalPages).toBe(5);
  });
});
