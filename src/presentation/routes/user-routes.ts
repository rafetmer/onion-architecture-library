import { Router } from 'express';
import { UserController } from '../controllers/user-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { AuthService } from '../../application/services/auth-service.js';

export const createUserRoutes = (
    userController: UserController,
    authService: AuthService
): Router => {
    const router = Router();
    const checkAuth = authMiddleware(authService);

    // Public routes
    router.get('/', userController.findAll.bind(userController));
    router.get('/:id', userController.findById.bind(userController));
    router.get('/email/:email', userController.findUserByEmail.bind(userController));
    router.get('/me/profile', checkAuth, userController.getMyProfile.bind(userController));
    router.get('/me/loans', checkAuth, userController.getMyLoans.bind(userController));

    // Protected routes - yetkilendirme gerektirir
    router.post('/', checkAuth, userController.create.bind(userController));
    router.put('/:id', checkAuth, userController.update.bind(userController));
    router.delete('/:id', checkAuth, userController.delete.bind(userController));

    

    return router;
}