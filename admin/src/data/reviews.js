import { products } from './products';

const productNameById = (id) => products.find((p) => p.id === id)?.name ?? 'Unknown Product';

const raw = [
    { id: 101, productId: 1, name: 'Ahmed Raza', rating: 5, date: '2026-06-14', comment: 'Mixes smoothly and the chocolate flavor actually tastes good. Noticed better recovery within two weeks.', adminReply: '' },
    { id: 102, productId: 1, name: 'Sara Khan', rating: 5, date: '2026-05-30', comment: "Best whey I've used so far, no bloating and great taste.", adminReply: 'Thanks Sara, glad you loved it!' },
    { id: 103, productId: 1, name: 'Bilal Hassan', rating: 4, date: '2026-05-02', comment: 'Good quality protein, wish the tub was a bit bigger for the price.', adminReply: '' },
    { id: 201, productId: 2, name: 'Fatima Noor', rating: 5, date: '2026-06-20', comment: 'Perfect before bed, keeps me full and helps with recovery overnight.', adminReply: '' },
    { id: 202, productId: 2, name: 'Usman Tariq', rating: 4, date: '2026-04-18', comment: 'Thick texture, takes a bit more mixing but works great.', adminReply: '' },
    { id: 301, productId: 3, name: 'Hina Malik', rating: 5, date: '2026-06-05', comment: "Crunchy, tasty, and doesn't feel like a diet bar at all.", adminReply: 'Appreciate the feedback!' },
    { id: 302, productId: 3, name: 'Zeeshan Ali', rating: 4, date: '2026-03-22', comment: 'Great snack for post workout, could use more flavor variety.', adminReply: '' },
    { id: 401, productId: 4, name: 'Ayesha Siddiqui', rating: 4, date: '2026-05-11', comment: 'Love that it has collagen too, good for skin and joints.', adminReply: '' },
    { id: 501, productId: 5, name: 'Hamza Sheikh', rating: 4, date: '2026-06-01', comment: 'Convenient for busy mornings, tastes decent straight from the bottle.', adminReply: '' },
    { id: 502, productId: 5, name: 'Mahnoor Iqbal', rating: 5, date: '2026-04-27', comment: 'Great grab-and-go option, will buy again.', adminReply: '' },
    { id: 701, productId: 7, name: 'Faisal Mahmood', rating: 5, date: '2026-06-25', comment: 'Pure creatine, no fillers, noticeable strength gains within a month.', adminReply: '' },
    { id: 702, productId: 7, name: 'Nadia Chaudhry', rating: 5, date: '2026-06-10', comment: 'Dissolves easily and no stomach discomfort at all.', adminReply: '' },
    { id: 703, productId: 7, name: 'Omar Farooq', rating: 5, date: '2026-05-15', comment: 'This is my third tub, consistently good quality.', adminReply: '' },
];

export const reviews = raw.map((r) => ({
    ...r,
    productName: productNameById(r.productId),
}));
