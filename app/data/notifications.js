// Testing-mode fallback so the notification bell has something to show
// without a backend running. Shape matches `toPublicNotification` on the
// API so components don't need to branch on testingMode.
const notifications = [
    {
        id: 'mock-1',
        title: 'Welcome to Fitoo',
        message: "Thanks for joining — explore our lab-tested supplements and personalized diet plans.",
        type: 'info',
        date: '2026-08-04',
        isRead: false,
    },
    {
        id: 'mock-2',
        title: 'New Year, New Goals',
        message: 'Kick off the year with 20% off all consultation plans this week only.',
        type: 'promo',
        date: '2026-08-02',
        isRead: false,
    },
    {
        id: 'mock-3',
        title: 'Payment Verification Delay',
        message: 'Payment verifications may take up to 24 hours longer than usual this week.',
        type: 'alert',
        date: '2026-07-28',
        isRead: true,
    },
];

export default notifications;
