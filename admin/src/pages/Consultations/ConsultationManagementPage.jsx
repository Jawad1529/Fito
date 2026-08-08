import { useEffect, useState } from 'react';
import { Tabs, message } from 'antd';
import PageHeading from '../../components/atoms/PageHeading';
import ConsultationTable from '../../components/organisms/consultations/ConsultationTable';
import { CONSULTATION_GOALS } from '../../constants/consultationGoals';
import { consultationsByGoal } from '../../data/consultations';
import { useTestingMode } from '../../context/TestingModeContext';
import { fetchConsultations } from '../../api/consultations.api';

const toRow = (c) => ({ ...c, user: c.personalInfo?.fullName });

export default function ConsultationManagementPage() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <ConsultationManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ConsultationManagementPageInner({ testingMode }) {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(!testingMode);

    useEffect(() => {
        if (testingMode) return;
        let cancelled = false;
        fetchConsultations()
            .then((data) => {
                if (!cancelled) setConsultations(data.map(toRow));
            })
            .catch(() => {
                if (!cancelled) message.error('Failed to load consultations');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [testingMode]);

    const byGoal = (goalId) =>
        testingMode ? consultationsByGoal[goalId] ?? [] : consultations.filter((c) => c.goal === goalId);

    const allConsultations = testingMode
        ? Object.values(consultationsByGoal).flat()
        : consultations;

    return (
        <div>
            <PageHeading title="Consultation Management" subtitle="Review and manage consultations by goal category" />
            <Tabs
                defaultActiveKey="all"
                items={[
                    {
                        key: 'all',
                        label: <span>🗂 All</span>,
                        children: (
                            <ConsultationTable
                                key={`all-${loading}`}
                                initialData={allConsultations}
                                testingMode={testingMode}
                                loading={!testingMode && loading}
                                showGoal
                            />
                        ),
                    },
                    ...CONSULTATION_GOALS.map((goal) => ({
                        key: goal.id,
                        label: (
                            <span>
                                {goal.icon} {goal.title}
                            </span>
                        ),
                        children: (
                            <ConsultationTable
                                key={`${goal.id}-${loading}`}
                                initialData={byGoal(goal.id)}
                                testingMode={testingMode}
                                loading={!testingMode && loading}
                            />
                        ),
                    })),
                ]}
            />
        </div>
    );
}
