import express from 'express';
import {
    listProducts,
    listProductCategories,
    getProduct,
} from '../controllers/products.controller.js';

const router = express.Router();

// Public catalogue — no auth, browsing doesn't require an account.
router.get('/', listProducts);
// Declared before '/:id' so "categories" isn't swallowed as an id.
router.get('/categories', listProductCategories);
router.get('/:id', getProduct);

export default router;
