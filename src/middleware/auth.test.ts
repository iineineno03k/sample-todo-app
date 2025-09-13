import { type NextFunction, Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import { type AuthRequest, authenticateToken } from './auth';

// 🧪 認証ミドルウェア テスト
describe('認証ミドルウェア', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('✅ 有効なトークンで認証が成功する', () => {
    // 有効なトークンを生成
    const validToken = jwt.sign({ userId: 'user123', username: 'testuser' }, 'simple-secret-key', {
      expiresIn: '7d',
    });

    mockRequest.headers = {
      authorization: `Bearer ${validToken}`,
    };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    // ユーザー情報がリクエストに追加されることを確認
    expect(mockRequest.userId).toBe('user123');
    expect(mockRequest.username).toBe('testuser');
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('❌ Authorizationヘッダーがない場合はエラー', () => {
    mockRequest.headers = {};

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'ログインが必要です',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('❌ Bearerトークンの形式が間違っている場合はエラー', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat',
    };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'ログインが必要です',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('❌ 無効なトークンの場合はエラー', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'トークンが無効です',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('❌ 期限切れトークンの場合はエラー', () => {
    // 期限切れトークンを生成（-1秒で即座に期限切れ）
    const expiredToken = jwt.sign(
      { userId: 'user123', username: 'testuser' },
      'simple-secret-key',
      { expiresIn: '-1s' }
    );

    mockRequest.headers = {
      authorization: `Bearer ${expiredToken}`,
    };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'トークンが無効です',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('❌ 異なるシークレットで署名されたトークンはエラー', () => {
    // 異なるシークレットで署名
    const wrongSecretToken = jwt.sign(
      { userId: 'user123', username: 'testuser' },
      'wrong-secret-key',
      { expiresIn: '7d' }
    );

    mockRequest.headers = {
      authorization: `Bearer ${wrongSecretToken}`,
    };

    authenticateToken(mockRequest as AuthRequest, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'トークンが無効です',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
