'use client';

import { Upload, Card, Typography, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function PhotoUploadStep({
  formData,
  updateField,
}) {
  const uploads = formData.uploads || {};

  const updatePhotos = ({ fileList }) => {
    updateField("uploads", {
      ...uploads,
      bodyPhotos: fileList,
    });
  };

  const updateReports = ({ fileList }) => {
    updateField("uploads", {
      ...uploads,
      reports: fileList,
    });
  };

  return (
    <div className="space-y-8">

      <div>
        <Title level={3} className="!text-white">
          Upload Your Photos
        </Title>

        <Paragraph className="!text-gray-400">
          These photos help our nutritionists assess your current physique and
          provide more accurate recommendations.
        </Paragraph>
      </div>

      <Alert
        type="info"
        showIcon
        message="Photo Guidelines"
        description={
          <ul className="list-disc pl-5 mt-2">
            <li>Stand in good lighting.</li>
            <li>Wear fitted clothing.</li>
            <li>Capture your full body.</li>
            <li>Avoid mirrors and heavy filters.</li>
          </ul>
        }
      />

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>Body Photos</Title>

        <Text className="block text-gray-400 mb-4">
          Upload Front, Side and Back photos.
        </Text>

        <Upload
          listType="picture-card"
          beforeUpload={() => false}
          multiple
          fileList={uploads.bodyPhotos}
          onChange={updatePhotos}
        >
          <div>
            <PlusOutlined />
            <div className="mt-2">Upload</div>
          </div>
        </Upload>

      </Card>

      <Card className="bg-white/5 border-white/10">

        <Title level={5}>
          Medical Reports (Optional)
        </Title>

        <Paragraph className="text-gray-400">
          Upload blood work, hormone reports or any medical reports if available.
        </Paragraph>

        <Upload
          beforeUpload={() => false}
          multiple
          fileList={uploads.reports}
          onChange={updateReports}
        >
          <button className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10">
            Upload Reports
          </button>
        </Upload>

      </Card>

    </div>
  );
}