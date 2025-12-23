import { User as SupabaseUser } from './models/userModel'; // Or wherever your User interface is

declare global {
    namespace Express {
        interface User {
            user_id: string;
            email: string;
        }
    }
}
