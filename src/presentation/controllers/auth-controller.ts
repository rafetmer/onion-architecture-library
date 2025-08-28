import { Request, Response } from 'express';   
import { AuthService } from '../../application/services/auth-service.js';
import { CreateUserDto } from '../../application/services/user-service.js';

export class AuthController {
    constructor(private readonly authService:AuthService) {}

    async register(req:Request, res:Response) {
        const {name , email, password } = req.body as CreateUserDto;
        try {
            const user = await this.authService.register(name, email, password);
            res.status(201).json(user);
        } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({message});
        }
    }

    async login(req:Request, res:Response) {
        const { email, password } = req.body;
        try {
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error'; //TS de error unknown olarak döndüğü icin erroru bi typea atamamız gerekiyor
            res.status(401).json({message});
        }
    }
};