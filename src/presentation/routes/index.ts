import { Router } from 'express';
import { createAuthRoutes } from './auth-routes.js';
import { createUserRoutes } from './user-routes.js';
import { createBookRoutes } from './book-routes.js';
import { createLoanRoutes } from './loan-routes.js';

import { AuthController } from '../controllers/auth-controller.js';
import { UserController } from '../controllers/user-controller.js';
import { BookController } from '../controllers/book-controller.js';
import { LoanController } from '../controllers/loan-controller.js';
import { AuthService } from '../../application/services/auth-service.js';

interface AppControllers {
    authController: AuthController;
    userController: UserController;
    bookController: BookController;
    loanController: LoanController;
    authService: AuthService;
}

export const createApiRouter = (controller: AppControllers): Router => {      
    const router = Router();
    const { authController, userController, bookController, loanController, authService } = controller;

    router.use('/auth', createAuthRoutes(authController, authService));
    router.use('/users', createUserRoutes(userController, authService));
    router.use('/books', createBookRoutes(bookController, authService));
    router.use('/loans', createLoanRoutes(loanController, authService));

    return router;
}