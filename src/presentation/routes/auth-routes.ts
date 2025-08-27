import { Router } from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { AuthService } from '../../application/services/auth-service.js';


export const createAuthRoutes = (
    authController: AuthController,
    authService: AuthService
): Router => {
    const router = Router();
    const checkAuth = authMiddleware(authService);


    router.post('/register', authController.register.bind(authController));
    router.post('/login', authController.login.bind(authController));

    return router;
}