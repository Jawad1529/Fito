import { Tabs } from 'antd';
import PageHeading from '../../components/atoms/PageHeading';
import ConsultationTable from '../../components/organisms/consultations/ConsultationTable';
import { CONSULTATION_GOALS } from '../../constants/consultationGoals';
import { consultationsByGoal } from '../../data/consultations';

export default function ConsultationManagementPage() {
    return (
        <div>
            <PageHeading title="Consultation Management" subtitle="Review and manage consultations by goal category" />
            <Tabs
                defaultActiveKey={CONSULTATION_GOALS[0].id}
                items={CONSULTATION_GOALS.map((goal) => ({
                    key: goal.id,
                    label: (
                        <span>
                            {goal.icon} {goal.title}
                        </span>
                    ),
                    children: <ConsultationTable initialData={consultationsByGoal[goal.id] ?? []} />,
                }))}
            />
        </div>
    );
}
