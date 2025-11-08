"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/**
 * Minimal in-file UserService implementation to satisfy the import error.
 * Replace with the real service implementation (e.g., ../services/userService)
 * when that file exists in the project.
 */
class UserService {
    constructor() {
        this.users = [];
    }
    async createUser(userData) {
        const newUser = { id: Date.now().toString(), ...userData };
        this.users.push(newUser);
        return newUser;
    }
    async authenticateUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        return user || null;
    }
}
class AuthController {
    constructor() {
        this.userService = new UserService();
    }
    async register(req, res) {
        try {
            const userData = req.body;
            const newUser = await this.userService.createUser(userData);
            res.status(201).json(newUser);
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error?.message || 'Bad Request' });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userService.authenticateUser(email, password);
            if (user) {
                res.status(200).json({ message: 'Login successful', user });
            }
            else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ message: error?.message || 'Bad Request' });
        }
    }
    async logout(req, res) {
        try {
            // Logic for logging out the user (e.g., clearing session)
            res.status(200).json({ message: 'Logout successful' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: error?.message || 'Bad Request' });
        }
    }
}
exports.AuthController = AuthController;
