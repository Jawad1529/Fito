// Shared between the About page UI and its schema.org AboutPage markup, so the
// team listed to crawlers can't drift from the team shown on screen.
import owner1 from '@/assets/images/owner1.webp';
import owner2 from '@/assets/images/owner2.webp';

export const TEAM_MEMBERS = [
    {
        name: 'Muhammad Umer',
        title: 'Co-Founder & Head Coach & Lead Nutritionist',
        image: owner1,
        credentials: ['CISSN Certified', '10+ Yrs Coaching'],
    },
    {
        name: 'Abdul Basit',
        title: 'Co-Founder & Operations',
        image: owner2,
        credentials: ['MBA', 'Supply Chain'],
    },
];

export const ABOUT_STATS = [
    { value: '10,000+', label: 'Clients Coached' },
    { value: '50,000+', label: 'Orders Fulfilled' },
    { value: '4.9/5', label: 'Avg. Rating' },
];
