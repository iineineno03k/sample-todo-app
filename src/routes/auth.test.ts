import request from 'supertest';
import app from '../app';

// 🧪 認証API テスト
describe('認証API', () => {
  // 📝 ユーザー登録のテスト
  describe('POST /auth/register', () => {
    it('✅ 正常なユーザー登録ができる', async () => {
      const userData = {
        username: 'testuser',
        password: 'testpass123',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(201);

      // レスポンスの確認
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user).toHaveProperty('id');

      // パスワードがレスポンスに含まれていないことを確認
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('❌ ユーザー名が空の場合はエラー', async () => {
      const userData = {
        username: '',
        password: 'testpass123',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ユーザー名とパスワードが必要です');
    });

    it('❌ パスワードが空の場合はエラー', async () => {
      const userData = {
        username: 'testuser',
        password: '',
      };

      const response = await request(app).post('/auth/register').send(userData).expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ユーザー名とパスワードが必要です');
    });

    it('❌ 既存のDBにユーザーがある場合、同じユーザー名で登録するとエラー', async () => {
      // 事前条件: Prismaで直接DBに既存ユーザーを作成
      await global.prisma.user.create({
        data: {
          username: 'existinguser',
          password: 'existingpass123',
        },
      });

      // テスト実行: 同じユーザー名で再度登録を試行
      const duplicateUserData = {
        username: 'existinguser', // 既存と同じユーザー名
        password: 'differentpass456', // パスワードは異なる
      };

      const response = await request(app)
        .post('/auth/register')
        .send(duplicateUserData)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('このユーザー名は既に使用されています');
    });

    it('✅ 異なるユーザー名なら既存ユーザーがいても登録できる', async () => {
      // 事前条件: Prismaで直接DBに既存ユーザーを作成
      await global.prisma.user.create({
        data: {
          username: 'user1',
          password: 'pass123',
        },
      });

      // テスト実行: 異なるユーザー名で登録
      const newUserData = {
        username: 'user2', // 異なるユーザー名
        password: 'pass456',
      };

      const response = await request(app).post('/auth/register').send(newUserData).expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('user2');
    });
  });

  // 🔑 ログインのテスト
  describe('POST /auth/login', () => {
    // 事前条件: Prismaで直接テスト用ユーザーをDBに作成
    beforeEach(async () => {
      await global.prisma.user.create({
        data: {
          username: 'loginuser',
          password: 'loginpass123',
        },
      });
    });

    it('✅ DBに存在するユーザーの正しい認証情報でログインできる', async () => {
      // テスト実行: 既存ユーザーの正しい認証情報でログイン
      const loginData = {
        username: 'loginuser', // beforeEachで作成済み
        password: 'loginpass123', // 正しいパスワード
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(200);

      // レスポンスの確認
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe(loginData.username);
      expect(response.body.user).toHaveProperty('id');
    });

    it('❌ DBに存在しないユーザー名でログインするとエラー', async () => {
      // テスト実行: DBに存在しないユーザー名でログイン試行
      const loginData = {
        username: 'nonexistentuser', // DBに存在しない
        password: 'anypassword',
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ユーザー名またはパスワードが間違っています');
    });

    it('❌ 既存ユーザーでも間違ったパスワードでログインするとエラー', async () => {
      // テスト実行: 既存ユーザーだが間違ったパスワードでログイン試行
      const loginData = {
        username: 'loginuser', // beforeEachで作成済み（存在する）
        password: 'wrongpassword', // 間違ったパスワード（正解は'loginpass123'）
      };

      const response = await request(app).post('/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ユーザー名またはパスワードが間違っています');
    });
  });
});
