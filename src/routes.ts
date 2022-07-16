import express from 'express'
import { AuthenticatedUser, Login, Logout, Register, updatePassword, updateProfile } from './controllers/auth.controller'
import { Upload } from './controllers/image.controller';
import { Permissions } from './controllers/permission.controller';
import { createProduct, deleteProduct, getProductById, Products, updateProduct } from './controllers/product.controller';
import { createRole, deleteRole, getRole, Roles, updateRole } from './controllers/role.controller';
import { createUser, deleteUser, getUserById, updateUser, users } from './controllers/user.controller';
import { AuthMiddleware } from './middleware/auth.middleware';
const router = express.Router()
import path from 'path'
import { Chart, Export, Orders } from './controllers/order.controller';
import { PermissionMiddleware } from './middleware/permission.middleware';

// auth routes
router.post('/auth/register', Register);
router.post('/auth/login', Login);
router.get('/auth/user', AuthMiddleware, AuthenticatedUser);
router.post('/auth/logout', AuthMiddleware, Logout);
router.put('/auth/updateProfile', AuthMiddleware, updateProfile);
router.put('/auth/updatePassword', AuthMiddleware, updatePassword);

//users routes
router.get("/users", AuthMiddleware, PermissionMiddleware('users'), users);
router.post('/new/user', AuthMiddleware, PermissionMiddleware('users'), createUser);
router.get('/user/:id', AuthMiddleware, PermissionMiddleware('users'), getUserById);
router.put('/user/:id', AuthMiddleware, PermissionMiddleware('users'), updateUser);
router.delete('/user/:id', AuthMiddleware, PermissionMiddleware('users'), deleteUser);

//permissions/roles routes
router.get('/permissions', AuthMiddleware, Permissions);
router.get('/roles', AuthMiddleware, Roles);
router.post('/roles', AuthMiddleware, createRole);
router.get('/role/:id', AuthMiddleware, getRole);
router.put('/role/:id', AuthMiddleware, updateRole);
router.delete('/role/:id', AuthMiddleware, deleteRole);

//products routes
router.get("/products", AuthMiddleware, PermissionMiddleware('products'), Products);
router.post('/new/product', AuthMiddleware, PermissionMiddleware('products'), createProduct);
router.get('/product/:id', AuthMiddleware, PermissionMiddleware('products'), getProductById);
router.put('/product/:id', AuthMiddleware, PermissionMiddleware('products'), updateProduct);
router.delete('/product/:id', AuthMiddleware, PermissionMiddleware('products'), deleteProduct);
//upload images
router.post('/image/upload', AuthMiddleware, Upload);

//orders
router.get('/orders', AuthMiddleware, Orders);
router.post('/export', AuthMiddleware, Export);
router.get('/chart', AuthMiddleware, Chart);



export default router;