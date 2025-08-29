import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createApiRouter } from './routes/index.js';

import { PrismaBookRepository } from '../infrastructure/repositories/prisma-book-repository.js';
import { PrismaUserRepository } from '../infrastructure/repositories/prisma-user-repository.js';
import { PrismaLoanRepository } from '../infrastructure/repositories/prisma-loan-repository.js';

// Servisler
import { BookService } from '../application/services/book-service.js';
import { UserService } from '../application/services/user-service.js';
import { LoanService } from '../application/services/loan-service.js';
import { AuthService } from '../application/services/auth-service.js';

// Controller'lar
import { BookController } from './controllers/book-controller.js';
import { UserController } from './controllers/user-controller.js';
import { LoanController } from './controllers/loan-controller.js';
import { AuthController } from './controllers/auth-controller.js';



async function main(){
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(express.json());

  const prisma = new PrismaClient();
  const userRepository = new PrismaUserRepository();
  const loanRepository = new PrismaLoanRepository();  
  const bookRepository = new PrismaBookRepository();

  const authService = new AuthService(userRepository);
  const userService = new UserService(userRepository);
  const loanService = new LoanService(loanRepository, bookRepository, userRepository);
  const bookService = new BookService(bookRepository);
  
  const authController = new AuthController(authService);
  const bookController = new BookController(bookService);
  const userController = new UserController(userService, loanService);
  const loanController = new LoanController(loanService);

  const apiRouter = createApiRouter({ authController, userController, bookController, loanController, authService });

  app.use('/api', apiRouter); 
  app.get('/health', (req, res) => res.send('OK')); // Sağlık kontrolü için basit bir endpoint
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

main().catch((error) => {
  console.error('Sunucu başlatılamadı:', error);
  process.exit(1);
});

