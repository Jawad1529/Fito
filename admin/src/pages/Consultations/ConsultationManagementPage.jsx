import { Tabs } from 'antd';
import PageHeading from '../../components/atoms/PageHeading';
import ConsultationTable from '../../components/organisms/consultations/ConsultationTable';
import { CONSULTATION_GOALS } from '../../constants/consultationGoals';
import { consultationsByGoal } from '../../data/consultations';
import { useTestingMode } from '../../context/TestingModeContext';

export default function ConsultationManagementPage() {
    const { testingMode } = useTestingMode();
    // Remounts (resetting all local state) whenever testing mode is toggled,
    // instead of syncing that reset through an effect.
    return <ConsultationManagementPageInner key={testingMode} testingMode={testingMode} />;
}

function ConsultationManagementPageInner({ testingMode }) {
    const byGoal = (goalId) => (testingMode ? consultationsByGoal[goalId] ?? [] : []);
    const allConsultations = testingMode ? Object.values(consultationsByGoal).flat() : [];

    return (
        <div>
            <PageHeading title="Consultation Management" subtitle="Review and manage consultations by goal category" />
            <Tabs
                defaultActiveKey="all"
                // Real mode fetches per-tab (each tab scopes its own paginated
                // query by goal), so only the active tab needs to be mounted.
                destroyInactiveTabPane
                items={[
                    {
                        key: 'all',
                        label: <span>🗂 All</span>,
                        children: (
                            <ConsultationTable initialData={allConsultations} testingMode={testingMode} showGoal />
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
                                initialData={byGoal(goal.id)}
                                testingMode={testingMode}
                                goal={goal.id}
                            />
                        ),
                    })),
                ]}
            />
        </div>
    );
}
