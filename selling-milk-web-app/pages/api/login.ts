import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/database/mongoose';
import { loginUser } from '@/lib/database/controllers/UserController';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    try {
      const data = await loginUser(email, password);

      res.status(200).json({ token: data.token, data: data.user, message: "Đăng nhập thành công" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Phương thức không đúng' });
  }
}
