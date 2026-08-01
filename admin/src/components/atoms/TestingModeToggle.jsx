import { Switch, Tooltip } from 'antd';
import { ExperimentOutlined } from '@ant-design/icons';
import { useTestingMode } from '../../context/TestingModeContext';

export default function TestingModeToggle() {
    const { testingMode, setTestingMode } = useTestingMode();

    return (
        <Tooltip
            title={
                testingMode
                    ? 'Testing mode is ON — using mock data, no API calls'
                    : 'Testing mode is OFF — using the live API'
            }
        >
            <div className="flex items-center gap-2">
                <ExperimentOutlined className="text-gray-400" />
                <span className="text-sm text-gray-600 hidden sm:inline">Testing Mode</span>
                <Switch size="small" checked={testingMode} onChange={setTestingMode} />
            </div>
        </Tooltip>
    );
}
