import { Request, Response} from "express";
import { User  } from "../../domain/entities/user.js";
import { UserService, CreateUserDto, UpdateUserDto } from "../../application/services/user-service.js";
import { BaseController } from "./base-controller.js";


export class UserController extends BaseController<User, CreateUserDto, UpdateUserDto> {
    protected readonly service: UserService;

    constructor(userService: UserService) {
        super();
        this.service = userService;
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

}