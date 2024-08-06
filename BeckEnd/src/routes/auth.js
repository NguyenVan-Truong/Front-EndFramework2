// routes/authRoutes.js
import { Router } from 'express';
import { deleteUser, forgotPassword, getAllUser, getUserById, lockUserAccount, signIn, signUp, updateUser } from '../controllers/auth.js';
import User from '../models/User.js';

const routerAuth = Router();

routerAuth.post('/signup', signUp);
routerAuth.post('/signin', signIn);
routerAuth.post('/forgot', forgotPassword);
routerAuth.get('/', getAllUser);
routerAuth.get('/:id', getUserById);
routerAuth.patch('/:id', updateUser);
routerAuth.delete('/:id', deleteUser);

// Khóa tài khoản người dùng
routerAuth.post('/:id/lock', lockUserAccount);



export default routerAuth;
