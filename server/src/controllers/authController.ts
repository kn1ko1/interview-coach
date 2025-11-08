import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class AuthController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: String(error) });
            }
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const user = await this.userService.authenticateUser(email, password);
            if (user) {
                res.status(200).json({ message: 'Login successful', user });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(400).json({ message: String(error) });
            }
        }
    }

    public async logout(req: Request, res: Response): Promise<void> {
        try {
            // Adjust this to your actual logout logic (clear cookies, revoke tokens, etc.)
            res.status(200).json({ message: 'Logout successful' });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(500).json({ message: error.message });
            } else {
                res.status(500).json({ message: String(error) });
            }
        }
    }
}