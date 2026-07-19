'use client';

import { PlusOutlined } from '@ant-design/icons';

import Card from '../../atoms/Card';
import { H3, H5, Text } from '../../atoms/Typography';
import Alert from '../../atoms/Alert';
import Upload from '../../atoms/Upload';

export default function PhotoUploadStep({
  formData,
  updateField,
}) {
  const uploads = formData.uploads || {};

  const updatePhotos = (files) => {
    updateField("uploads", {
      ...uploads,
      bodyPhotos: files,
    });
  };

  const updateReports = (files) => {
    updateField("uploads", {
      ...uploads,
      reports: files,
    });
  };

  return (
    <div className="space-y-6!">

      <div>
        <H3>
          Upload Your Photos
        </H3>

        <Text muted>
          These photos help our nutritionists assess your current physique and
          provide more accurate recommendations.
        </Text>
      </div>

      <Alert
        type="info"
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

      <Card className="bg-surface border border-border">

        <H5>Body Photos</H5>

        <Text muted className="block mb-4">
          Upload Front, Side and Back photos.
        </Text>

        <Upload
          picture
          multiple
          accept="image/*"
          value={uploads.bodyPhotos || []}
          onChange={updatePhotos}
        >
          <PlusOutlined />
          <div className="mt-1 text-xs">Upload</div>
        </Upload>

      </Card>

      <Card className="bg-surface border border-border">

        <H5 className="mb-2">
          Medical Reports (Optional)
        </H5>

        <Text muted className="block mb-4">
          Upload blood work, hormone reports or any medical reports if available.
        </Text>

        <Upload
          multiple
          value={uploads.reports || []}
          onChange={updateReports}
        >
          Upload Reports
        </Upload>

      </Card>

    </div>
  );
}
