import * as cdk from 'aws-cdk-lib';
import { GalleryPocStack } from '../lib/gallery-poc-stack';

const app = new cdk.App();

// Pass with: npm run cdk -- deploy -c studentId=<id>
const studentId = app.node.tryGetContext('studentId');
if (!studentId) {
  throw new Error('Missing context: -c studentId=<your-student-id>');
}

new GalleryPocStack(app, 'PriyaWeddingsPoc', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'ap-southeast-1' },
  bucketName: `priya-weddings-${String(studentId).toLowerCase()}`,
  weddingPrefix: 'tan-and-mei-wedding-2026',
});
