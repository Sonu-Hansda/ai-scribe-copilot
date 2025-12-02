const { request, getAuthHeader } = require('../utils/helper');
const db = require('../../src/db');

const SEEDED_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('Template Management', () => {
  describe('Get User Templates', () => {
    it('should return seeded templates for user', async () => {
      const res = await request()
        .get('/v1/fetch-default-template-ext')
        .query({ userId: SEEDED_USER_ID })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            type: expect.stringMatching(/default|predefined|custom/)
          })
        ])
      );
      // Verify at least the seeded templates exist
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('should return 400 for missing userId', async () => {
      const res = await request()
        .get('/v1/fetch-default-template-ext')
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing userId parameter');
    });

    it('should return 400 for invalid userId format', async () => {
      const res = await request()
        .get('/v1/fetch-default-template-ext')
        .query({ userId: 'invalid-uuid' })
        .set(getAuthHeader());

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid userId format');
    });

    it('should return empty array for user with no templates', async () => {
      // Create a new user without templates
      const newUserId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
      await db.query(
        'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [newUserId, 'newuser@example.com']
      );

      const res = await request()
        .get('/v1/fetch-default-template-ext')
        .query({ userId: newUserId })
        .set(getAuthHeader());

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
    });
  });
});
