const { request, getAuthHeader } = require('../utils/helper');
const db = require('../../src/db');

const SEEDED_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const SEEDED_USER_EMAIL = 'doctor@demo.com';

describe('User Resolution', () => {
  beforeEach(async () => {
    // Delete any users except the seeded demo user
    await db.query('DELETE FROM users WHERE id != $1', [SEEDED_USER_ID]);
  });

  describe('GET /users/{identifier}', () => {
    it('should return user by ID', async () => {
      const res = await request()
        .get(`/users/${SEEDED_USER_ID}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: SEEDED_USER_ID,
        email: SEEDED_USER_EMAIL
      });
    });

    it('should return user by email', async () => {
      const res = await request()
        .get(`/users/${encodeURIComponent(SEEDED_USER_EMAIL)}`)
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: SEEDED_USER_ID,
        email: SEEDED_USER_EMAIL
      });
    });

    it('should return 404 for unknown user ID', async () => {
      const unknownId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      const res = await request()
        .get(`/users/${unknownId}`)
        .set(getAuthHeader());

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 404 for unknown email', async () => {
      const res = await request()
        .get('/users/unknown@example.com')
        .set(getAuthHeader());

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });
  });
});
