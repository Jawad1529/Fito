import { appUsers } from './appUsers';

// Placeholder image used for uploaded photos/reports/receipts since we don't
// have real user uploads in this mock dataset.
const PLACEHOLDER_IMAGE =
    'https://img.magnific.com/free-photo/protein-gym_23-2151980040.jpg?semt=ais_hybrid&w=740&q=80';

const STATUSES = ['pending', 'in_review', 'completed'];

const GENDERS = ['male', 'female', 'other'];
const ACTIVITY_LEVELS = ['sedentary', 'light', 'moderate', 'active'];

// Goal-specific sample answers, mirroring the fields collected by each
// goal form in the main app (see app/components/organisms/forms/*).
const GOAL_DATA_BY_GOAL = {
    'fat-loss': (i) => ({
        currentWeight: 82 - i,
        targetWeight: 70 - i,
        waist: 96 - i,
        activity: ACTIVITY_LEVELS[i % ACTIVITY_LEVELS.length],
        sleep: 6 + (i % 3),
        water: 2 + (i % 3) * 0.5,
        meals: 3 + (i % 2),
        challenges: ['Sugar cravings', 'Late-night eating', 'Busy schedule'].slice(0, (i % 3) + 1),
        previousDiets: 'Tried keto and intermittent fasting before with mixed results.',
    }),
    'muscle-gain': (i) => ({
        targetWeight: 75 + i,
        primaryGoal: ['lean-muscle', 'strength', 'bulk'][i % 3],
        trainingExperience: ['beginner', 'intermediate', 'advanced'][i % 3],
        workoutDays: 3 + (i % 4),
        gymAccess: ['yes', 'no', 'home'][i % 3],
        mealsPerDay: 3 + (i % 3),
        protein: 140 + i * 5,
        water: 2.5 + (i % 3) * 0.5,
        sleep: 6 + (i % 3),
        injuries: i % 2 === 0 ? 'Old shoulder injury, avoid heavy overhead pressing.' : '',
    }),
    'body-recomposition': (i) => ({
        targetWeight: 68 + i,
        bodyFat: 22 - i,
        waist: 88 - i,
        workoutDays: 4 + (i % 3),
        cardioDays: 2 + (i % 3),
        experience: ['beginner', 'intermediate', 'advanced'][i % 3],
        meals: 3 + (i % 2),
        protein: 130 + i * 5,
        challenges: ['Hard to lose fat', 'Inconsistent workouts', 'Poor diet'].slice(0, (i % 3) + 1),
        sleep: 6 + (i % 3),
        notes: 'Wants a plan that fits around a 9-5 office job.',
    }),
    pcos: (i) => ({
        diagnosed: ['yes', 'no', 'unsure'][i % 3],
        diagnosisDate: '2024-08-12',
        medication: 'Metformin 500mg, Inositol',
        symptoms: ['Weight Gain', 'Irregular Periods', 'Fatigue', 'Acne'].slice(0, (i % 4) + 1),
        cycle: ['regular', 'irregular', 'very-irregular'][i % 3],
        lastPeriod: '2026-06-02',
        exercise: 2 + (i % 4),
        sleep: 6 + (i % 3),
        stress: 4 + (i % 5),
        goals: ['Weight Loss', 'Hormone Balance', 'Reduce Symptoms'].slice(0, (i % 3) + 1),
        notes: 'Struggles most with energy crashes in the afternoon.',
    }),
    'mother-wellness': (i) => ({
        stage: ['pregnant', 'postpartum', 'trying-to-conceive'][i % 3],
        stageDate: '2026-09-15',
        numChildren: i % 3,
        deliveryType: ['vaginal', 'c-section', 'na'][i % 3],
        breastfeeding: ['exclusively', 'partially', 'not', 'na'][i % 4],
        conditions: ['Anemia', 'Thyroid Issues', 'None'].slice(0, (i % 3) + 1),
        medications: 'Prenatal vitamins, iron supplement',
        meals: 3 + (i % 2),
        water: 2 + (i % 3) * 0.5,
        sleep: 5 + (i % 4),
        energy: 4 + (i % 5),
        goals: ['Regain Energy', 'Balanced Nutrition', 'Manage Cravings'].slice(0, (i % 3) + 1),
        notes: 'Wants meal ideas that are quick to prepare with a newborn at home.',
    }),
    diabetes: (i) => ({
        diabetesType: ['type-1', 'type-2', 'prediabetes', 'gestational'][i % 4],
        diagnosisDate: '2023-03-10',
        medication: 'Metformin, occasional insulin',
        fastingSugar: 100 + i * 4,
        postMealSugar: 150 + i * 5,
        hba1c: (6 + i * 0.2).toFixed(1),
        symptoms: ['Frequent Urination', 'Fatigue', 'Blurred Vision'].slice(0, (i % 3) + 1),
        exercise: 2 + (i % 4),
        sleep: 6 + (i % 3),
        stress: 3 + (i % 5),
        goals: ['Better Blood Sugar Control', 'Weight Management', 'Healthy Lifestyle'].slice(0, (i % 3) + 1),
        notes: 'Wants a plan that works around shift-work hours.',
    }),
};

const PLAN_OPTIONS = [
    { id: '1-month', label: '1 Month', durationMonths: 1, price: 5000 },
    { id: '3-month', label: '3 Months', durationMonths: 3, price: 13500 },
    { id: '6-month', label: '6 Months', durationMonths: 6, price: 24000 },
];

let seq = 1000;

const makeConsultation = (goal, i) => {
    const user = appUsers[i % appUsers.length];
    const plan = PLAN_OPTIONS[i % PLAN_OPTIONS.length];
    seq += 1;

    const dateStr = `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, '0')}`;

    return {
        id: `CNS-${seq}`,
        goal,
        status: STATUSES[i % STATUSES.length],
        user: user.name,
        assignedDate: dateStr,
        createdAt: dateStr,
        submittedAt: `${dateStr}T09:${String((i * 7) % 60).padStart(2, '0')}:00.000Z`,
        plan,
        personalInfo: {
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            dob: '1996-04-12',
            gender: GENDERS[i % GENDERS.length],
            activityLevel: ACTIVITY_LEVELS[i % ACTIVITY_LEVELS.length],
            height: 160 + (i % 30),
            weight: 60 + (i % 40),
        },
        goalData: GOAL_DATA_BY_GOAL[goal](i),
        uploads: {
            bodyPhotos: [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE],
            reports: i % 2 === 0 ? [PLACEHOLDER_IMAGE] : [],
            paymentScreenshot: [PLACEHOLDER_IMAGE],
        },
        transactionId: `TXN-${100000 + seq}`,
        conversation: [
            {
                id: 'welcome',
                sender: 'dietitian',
                text: "Hi! Thanks for submitting your consultation. I'll review your details and get back to you shortly.",
                timestamp: `${dateStr}T09:05:00.000Z`,
            },
            ...(i % 2 === 0
                ? [
                    {
                        id: 'user-1',
                        sender: 'user',
                        text: 'Thank you! Looking forward to my plan.',
                        timestamp: `${dateStr}T10:00:00.000Z`,
                    },
                ]
                : []),
        ],
    };
};

export const consultationsByGoal = {
    'fat-loss': Array.from({ length: 6 }, (_, i) => makeConsultation('fat-loss', i)),
    'muscle-gain': Array.from({ length: 5 }, (_, i) => makeConsultation('muscle-gain', i + 6)),
    'body-recomposition': Array.from({ length: 4 }, (_, i) => makeConsultation('body-recomposition', i + 11)),
    pcos: Array.from({ length: 4 }, (_, i) => makeConsultation('pcos', i + 15)),
    'mother-wellness': Array.from({ length: 3 }, (_, i) => makeConsultation('mother-wellness', i + 19)),
    diabetes: Array.from({ length: 3 }, (_, i) => makeConsultation('diabetes', i + 22)),
};
