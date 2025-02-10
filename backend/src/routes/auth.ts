import express, { Request, Response } from 'express';
import { register, login } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Token válido', user: req.user });
});

export default router;