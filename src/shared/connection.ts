// import {createConnection, getConnection, getRepository} from 'typeorm';
// import {AppDataSource} from '../../ormconfig';
// import {User} from '../entity/user/User';

// const connection = {
//   create: () => {
//     AppDataSource.initialize().catch(e => console.error(e));
//   },

//   close: () => {
//     // eslint-disable-next-line no-console
//     console.log('close connection');
//     getConnection()
//       .close()
//       .catch(e => console.error(e));
//   },

//   clear: () => {
//     const dbConnection = getConnection();
//     const entities = dbConnection.entityMetadatas;

//     entities.forEach(entity => {
//       const repository = dbConnection.getRepository(entity.name);
//       repository
//         .query(`DELETE FROM ${entity.tableName};`)
//         .catch(e => console.error(e));
//     });
//   },

//   createTestUsers: () => {
//     getConnection();
//     // Create a test user too
//     const user = new User();
//     user.email = 'test@test.com';
//     user.password = 'secret';
//     user.username = 'stan';
//     user.role = 'USER';
//     user.hashPassword();

//     getRepository(User)
//       .save(user)
//       .catch(e => console.error(e));

//     const admin = new User();
//     admin.email = 'admin@admin.com';
//     admin.password = 'secretadmin';
//     admin.username = 'jerry';
//     admin.role = 'ADMIN';
//     admin.hashPassword();
//     getRepository(User)
//       .save(admin)
//       .catch(e => console.error(e));
//   },
// };

const connection: any = {};

export {connection};
