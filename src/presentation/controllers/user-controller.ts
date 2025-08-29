import { Request, Response} from "express";
import { User  } from "../../domain/entities/user.js";
import { UserService, CreateUserDto, UpdateUserDto } from "../../application/services/user-service.js";
import { LoanService } from "../../application/services/loan-service.js";
import { BaseController } from "./base-controller.js";


export class UserController extends BaseController<User, CreateUserDto, UpdateUserDto> {
    protected readonly service: UserService;
    protected readonly loanService?: LoanService;

    constructor(userService: UserService, loanService?: LoanService) {
        super();
        this.service = userService;
        this.loanService = loanService;
    }

    async findUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const email = String(req.params.email);
            if (!email) {
                res.status(400).json({ message: "Invalid email format" });
                return;
            }
            const user = await this.service.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unknown error";
            res.status(500).json({ error: message });
        }
    }
    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz ID formatı' });
                return;
            }
            
            const user = await this.service.findById(id);
            if (!user) {
                res.status(404).json({ message: `ID ${id} ile kullanıcı bulunamadı` });
                return;
            }
            
            // GÜVENLİK: Şifreyi yanıttan çıkar.
            const { password, ...safeUser } = user;
            res.status(200).json(safeUser);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    // findAll metodunu da override etmeliyiz çünkü bir kullanıcı listesi döndürür.
    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.service.findAll();
            
            // GÜVENLİK: Listedeki her kullanıcının şifresini çıkar.
            const safeUsers = users.map(user => {
                const { password, ...safeUser } = user;
                return safeUser;
            });

            res.status(200).json(safeUsers);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

     async getMyProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                res.status(401).json({ message: 'Yetkilendirme başarısız: Kullanıcı kimliği bulunamadı.' });
                return;
            }
            const user = await this.service.findById(userId);
            if (!user) {
                res.status(404).json({ message: 'Profil bilgisi için kullanıcı bulunamadı.' });
                return;
            }
            const { password, ...safeUser } = user;
            if (this.loanService) {
                try {
                    const activeLoans = await this.loanService.findActiveLoansByUserId(userId);
                    (safeUser as any).loans = activeLoans;
                } catch (err) {
                    console.error('Error fetching user loans:', err instanceof Error ? err.message : err);
                }
            }

            res.status(200).json(safeUser);


        } catch (error) {
            const message = error instanceof Error ? error.message : "Bilinmeyen hata";
            res.status(500).json({ error: message });
        }
    }

    async getMyLoans(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;
            if (!userId) {
                res.status(401).json({ message: 'Yetkilendirme başarısız: Kullanıcı kimliği bulunamadı.' });
                return;
            }

            if (!this.loanService) {
                res.status(500).json({ message: 'LoanService not available' });
                return;
            }

            const loans = await this.loanService.findActiveLoansByUserId(userId);
            res.status(200).json(loans);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Bilinmeyen hata';
            res.status(500).json({ error: message });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = req.body as CreateUserDto;
            const { password, ...safeUser } = user;
            const created = await this.service.create(user);
            res.status(201).json(safeUser);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Oluşturma başarısız';
            res.status(400).json({ error: message });
        }
    }
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ message: 'Geçersiz ID formatı' });
                return;
            }

            const user = req.body as UpdateUserDto;
            const updatedUser = await this.service.update(id, user);
            if (!updatedUser) {
                res.status(404).json({ message: `ID ${id} ile kayıt bulunamadı` });
                return;
            }
            const { password, ...safeUser } = updatedUser;
            res.status(200).json(safeUser);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Güncelleme başarısız';
            res.status(400).json({ error: message });
        }
    }
};