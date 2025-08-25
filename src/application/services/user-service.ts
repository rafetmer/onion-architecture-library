import { User } from '../../domain/entities/user.js';
import { IUserRepository } from '../../domain/repositories/i-user.repository.js';
import { BaseService } from './base.service.js';

export type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDto = Partial<CreateUserDto>;

export class UserService extends BaseService<User, CreateUserDto, UpdateUserDto> {
    
    constructor(private readonly userRepository: IUserRepository) {
        super(userRepository);
    }

    // getById, getAll, deleteById metotları base serviceden alınıyor

    async create(dto: CreateUserDto): Promise<User> {
        const userAlreadyExists = await this.userRepository.findUserByEmail(dto.email);
        if (userAlreadyExists) {
            throw new Error(`Email '${dto.email}' is already in use.`);
        }
        
        console.log("New user being created");
        return this.userRepository.create(dto);
    }

    async update(id: number, dto: UpdateUserDto): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
           throw new Error(`User with ID ${id} not found. Update failed.`);
        }
        
        console.log(`Updating user ${id} with specific logic.`);
        return this.userRepository.update(id, dto);
    }

    async findUserByEmail(email: string): Promise<User | null> { // Genellikle bulunamazsa null döner
        const user = await this.userRepository.findUserByEmail(email);
        return user;
    }
}