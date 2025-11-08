export interface UserData {
    email: string;
    password: string;
    [key: string]: any;
}

export class UserService {
    public async createUser(userData: UserData): Promise<any> {
        // TODO: Replace with real DB logic, validation and password hashing.
        const { password, ...safe } = userData as any;
        // Return a minimal user representation for now.
        return {
            id: 'temp-id',
            ...safe,
        };
    }

    public async authenticateUser(email: string, password: string): Promise<any | null> {
        // TODO: Replace with real authentication logic (verify hashed password, fetch from DB).
        if (!email || !password) return null;
        // Return a mock user for development purposes.
        return {
            id: 'temp-id',
            email,
        };
    }
}