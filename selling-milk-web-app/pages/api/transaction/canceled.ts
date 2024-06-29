import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/database/mongoose';
import { cancelTransaction } from '@/lib/database/controllers/TransactionController';

connectDB();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { transactionId } = req.query;
            const { reason } = req.body;
            const transaction = await cancelTransaction(transactionId as string, reason);
            res.status(200).json({ data: transaction });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Phương thức không đúng' });
    }
}
