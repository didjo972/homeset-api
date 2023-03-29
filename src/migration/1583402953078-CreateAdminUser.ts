import {getRepository, MigrationInterface} from 'typeorm';
import {User} from '../entity/user/User';

export class CreateAdminUser1583402953078 implements MigrationInterface {
    public async up(): Promise<any> {
        const user = new User();
        user.username = 'admin';
        user.password = 'admin';
        user.hashPassword();
        user.role = 'ADMIN';
        const userRepository = getRepository(User);
        await userRepository.save(user);
    }

    public async down(): Promise<any> {
        // RAS
    }
}
