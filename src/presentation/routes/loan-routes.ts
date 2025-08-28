import { Router } from 'express';
import { LoanController } from '../controllers/loan-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { AuthService } from '../../application/services/auth-service.js';

export const createLoanRoutes = (
    loanController: LoanController,
    authService: AuthService
): Router => {
    const router = Router();
    const checkAuth = authMiddleware(authService);

    // Public routes
    router.get('/', loanController.findAll.bind(loanController));
    router.get('/:id', loanController.findById.bind(loanController));

    // Protected routes - yetkilendirme gerektirir
    router.post('/', checkAuth, loanController.create.bind(loanController));
    router.put('/:id', checkAuth, loanController.update.bind(loanController));
    router.delete('/:id', checkAuth, loanController.delete.bind(loanController));

    router.put('/return/:id', checkAuth, loanController.returnBook.bind(loanController));
    return router;
};
