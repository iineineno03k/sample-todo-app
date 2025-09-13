import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// 認証済みリクエストの型定義
export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

// JWTペイロードの型定義
interface JwtPayload {
  userId: string;
  username: string;
}

// 🔒 JWT認証ミドルウェア（初学者向けシンプル版）
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 1. Authorizationヘッダーからトークンを取得
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // "Bearer TOKEN" から TOKEN部分を取得

  if (!token) {
    return res.status(401).json({ error: 'ログインが必要です' });
  }

  try {
    // 2. JWTトークンを検証・デコード
    const decoded = jwt.verify(token, 'simple-secret-key') as JwtPayload;

    // 3. リクエストオブジェクトにユーザー情報を追加
    req.userId = decoded.userId;
    req.username = decoded.username;

    // 4. 次のミドルウェアまたはルートハンドラーに進む
    next();
  } catch (_error) {
    return res.status(403).json({ error: 'トークンが無効です' });
  }
};
