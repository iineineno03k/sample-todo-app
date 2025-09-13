import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import type { AuthResponse, CreateUserRequest, LoginRequest } from '../types';

const router = express.Router();
const prisma = new PrismaClient();

// 🔐 ユーザー登録
// 注意: このコードは学習用です。本番環境ではパスワードをハッシュ化してください！
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    const { username, password }: CreateUserRequest = req.body;

    // 入力チェック
    if (!username || !password) {
      return res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
    }

    // 既存ユーザーチェック
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'このユーザー名は既に使用されています' });
    }

    // ユーザー作成（パスワードは平文で保存 - 学習用のため）
    const user = await prisma.user.create({
      data: {
        username,
        password, // ⚠️ 平文パスワード（学習用）
      },
    });

    // JWTトークン生成（シンプル版）
    const token = jwt.sign(
      { userId: user.id, username: user.username }, // ペイロード
      'simple-secret-key', // シークレット（本番では環境変数を使用）
      { expiresIn: '7d' } // 7日間有効
    );

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 🔑 ユーザーログイン
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { username, password }: LoginRequest = req.body;

    // 入力チェック
    if (!username || !password) {
      return res.status(400).json({ error: 'ユーザー名とパスワードが必要です' });
    }

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
    }

    // パスワード確認（平文比較 - 学習用のため）
    if (user.password !== password) {
      return res.status(401).json({ error: 'ユーザー名またはパスワードが間違っています' });
    }

    // JWTトークン生成
    const token = jwt.sign({ userId: user.id, username: user.username }, 'simple-secret-key', {
      expiresIn: '7d',
    });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
