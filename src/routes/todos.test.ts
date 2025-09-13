import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app';

// 🧪 Todo API テスト
describe('Todo API', () => {
  let authToken: string;
  let userId: string;

  // 各テストの前に認証用のユーザーを直接DBに作成してトークン生成
  beforeEach(async () => {
    // Prismaで直接ユーザーを作成
    const user = await global.prisma.user.create({
      data: {
        username: 'todouser',
        password: 'todopass123',
      },
    });

    // JWTトークンを直接生成
    authToken = jwt.sign({ userId: user.id, username: user.username }, 'simple-secret-key', {
      expiresIn: '7d',
    });
    userId = user.id;
  });

  // 📝 Todo作成のテスト
  describe('POST /todos', () => {
    it('✅ 認証済みユーザーがTodoを作成できる', async () => {
      const todoData = {
        title: 'テスト用Todo',
        description: 'これはテスト用のTodoです',
      };

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      // レスポンスの確認
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBe(todoData.description);
      expect(response.body.status).toBe('TODO');
      expect(response.body.userId).toBe(userId);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
    });

    it('❌ 認証なしではTodoを作成できない', async () => {
      const todoData = {
        title: 'テスト用Todo',
        description: 'これはテスト用のTodoです',
      };

      const response = await request(app).post('/todos').send(todoData).expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ログインが必要です');
    });

    it('❌ タイトルが空の場合はエラー', async () => {
      const todoData = {
        title: '',
        description: 'これはテスト用のTodoです',
      };

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Title is required');
    });

    it('✅ 説明なしでもTodoを作成できる', async () => {
      const todoData = {
        title: 'タイトルのみのTodo',
      };

      const response = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBeNull();
    });
  });

  // 📋 Todo一覧取得のテスト
  describe('GET /todos', () => {
    it('✅ 認証済みユーザーのTodo一覧を取得できる', async () => {
      // テスト用Todoを複数作成
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo 1', description: '最初のTodo' });

      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Todo 2', description: '2番目のTodo' });

      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // レスポンスの確認
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Todo 2'); // 新しい順
      expect(response.body[1].title).toBe('Todo 1');
    });

    it('❌ 認証なしではTodo一覧を取得できない', async () => {
      const response = await request(app).get('/todos').expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('ログインが必要です');
    });

    it('✅ 他のユーザーのTodoは表示されない', async () => {
      // Prismaで直接別のユーザーを作成
      const otherUser = await global.prisma.user.create({
        data: {
          username: 'otheruser',
          password: 'otherpass123',
        },
      });

      // 別ユーザーのトークンを生成
      const otherToken = jwt.sign(
        { userId: otherUser.id, username: otherUser.username },
        'simple-secret-key',
        { expiresIn: '7d' }
      );

      // 各ユーザーがTodoを作成
      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'My Todo' });

      await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Other Todo' });

      // 最初のユーザーのTodo一覧を取得
      const response = await request(app)
        .get('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('My Todo');
    });
  });

  // 🔄 Todo更新のテスト
  describe('PUT /todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      // テスト用Todoを作成
      const createResponse = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '更新前のTodo',
          description: '更新前の説明',
        });

      todoId = createResponse.body.id;
    });

    it('✅ Todoを更新できる', async () => {
      const updateData = {
        title: '更新後のTodo',
        description: '更新後の説明',
      };

      const response = await request(app)
        .put(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.id).toBe(todoId);
    });

    it('❌ 存在しないTodoを更新するとエラー', async () => {
      const fakeId = 'fake-todo-id';
      const updateData = {
        title: '更新後のTodo',
      };

      const response = await request(app)
        .put(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Todo not found');
    });
  });

  // 🔄 Todo状態変更のテスト
  describe('PUT /todos/:id/status', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '状態変更テスト用Todo',
        });

      todoId = createResponse.body.id;
    });

    it('✅ Todo状態を変更できる', async () => {
      const statusData = {
        status: 'IN_PROGRESS',
      };

      const response = await request(app)
        .put(`/todos/${todoId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusData)
        .expect(200);

      expect(response.body.status).toBe('IN_PROGRESS');
      expect(response.body.id).toBe(todoId);
    });

    it('❌ 無効な状態を指定するとエラー', async () => {
      const statusData = {
        status: 'INVALID_STATUS',
      };

      const response = await request(app)
        .put(`/todos/${todoId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Valid status is required');
    });
  });

  // 🗑️ Todo削除のテスト
  describe('DELETE /todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '削除テスト用Todo',
        });

      todoId = createResponse.body.id;
    });

    it('✅ Todoを削除できる', async () => {
      await request(app)
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      // 削除されたことを確認
      await request(app)
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('❌ 存在しないTodoを削除するとエラー', async () => {
      const fakeId = 'fake-todo-id';

      const response = await request(app)
        .delete(`/todos/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Todo not found');
    });
  });
});
