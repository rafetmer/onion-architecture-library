import { Router } from 'express';
import { BookController } from '../controllers/book-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { AuthService } from '../../application/services/auth-service.js';


export const createBookRoutes = (
    bookController: BookController,
    authService: AuthService
): Router => {
    const router = Router();
    const checkAuth = authMiddleware(authService);

    // Public routes
    router.get('/', bookController.findAll.bind(bookController));
    router.get('/:id', bookController.findById.bind(bookController));
    router.get('/author/:author', bookController.findBooksByAuthor.bind(bookController));
    
    // Protected routes - yetkilendirme gerektirir
    router.post('/', checkAuth, bookController.create.bind(bookController));
    router.put('/:id', checkAuth, bookController.update.bind(bookController));
    router.delete('/:id', checkAuth, bookController.delete.bind(bookController));
    
    return router;

};

