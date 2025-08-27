import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth-service.js';

export const authMiddleware = (authService: AuthService) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Yetkilendirme tokeni gerekli.' });
            }
            
            const decoded = await authService.verifyToken(token);
            (req as any).user = decoded; // payload oluşturuyoruz burda id, email, name gibi değişkenler tutuluyor
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token' });
        }
    };
};