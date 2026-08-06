import path from 'node:path';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import adminAuthRoutes from './routes/adminAuth.routes.js';
import adminUsersRoutes from './routes/adminUsers.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import adminOrdersRoutes from './routes/adminOrders.routes.js';
import productsRoutes from './routes/products.routes.js';
import adminProductsRoutes from './routes/adminProducts.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import adminBlogsRoutes from './routes/adminBlogs.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import adminReviewsRoutes from './routes/adminReviews.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import adminNotificationsRoutes from './routes/adminNotifications.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Serves images saved by multer (see upload.middleware.js). Becomes unnecessary
// once uploads move to Cloudinary.
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/admin/blogs', adminBlogsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/admin/reviews', adminReviewsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin/notifications', adminNotificationsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
