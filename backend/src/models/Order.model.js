import mongoose from 'mongoose';
import { ORDER_STATUS } from '../constants/orderStatus.js';

// `user` is optional — checkout doesn't require login (guest checkout), so
// orders placed while signed in are linked to the account but guest orders
// are still accepted.
const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        items: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        total: { type: Number, required: true, min: 0 },
        paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
        transactionId: { type: String, trim: true },
        screenshotAttached: { type: Boolean, default: false },
        shipping: {
            name: { type: String, required: true, trim: true },
            phone: { type: String, required: true, trim: true },
            address: { type: String, required: true, trim: true },
            city: { type: String, required: true, trim: true },
        },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PROCESSING,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
