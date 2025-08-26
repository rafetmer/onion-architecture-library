import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { IUserRepository } from '../../domain/repositories/i-user-repository.js';
import { User } from '../../domain/entities/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'gizliAnahtar';
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET çevre değişkenlerinde tanımlı değil.');
}

export class AuthService {
    // Bağımlılığı dışarıdan al (constructor injection) ** ÖNEMLİ
    constructor(private readonly userRepository: IUserRepository) {}

    async register(username: string, email: string, password: string): Promise<Partial<User>> {
        const existingUser = await this.userRepository.findUserByEmail(email);
        if (existingUser) {
            throw new Error('Bu e-posta adresi zaten kullanılıyor.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await this.userRepository.create({
            name: username,
            email: email,
            password: hashedPassword    
        });

        return { name: newUser.name, email: newUser.email };
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Şifre yanlış');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        return token;
    }
}