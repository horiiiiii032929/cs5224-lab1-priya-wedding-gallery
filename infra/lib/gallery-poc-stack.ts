import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface GalleryPocStackProps extends cdk.StackProps {
  bucketName: string;
  weddingPrefix: string;
}

/**
 * Lab 1 Part 1 proof of concept: one wedding's photos, readable by URL,
 * but the bucket itself cannot be listed by the public.
 */
export class GalleryPocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GalleryPocStackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'GalleryBucket', {
      bucketName: props.bucketName,
      // ACLs disabled: access is governed only by the bucket policy below.
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // Keep ACL blocks on; relax only the policy blocks so the
      // public-read bucket policy is allowed to take effect.
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        ignorePublicAcls: true,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      // PoC only: allow `cdk destroy` to delete the bucket (empty it first).
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Public read of individual objects under the wedding prefix only.
    // Deliberately NO s3:ListBucket, so the bucket is not browsable.
    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'PublicReadWeddingPhotos',
        effect: iam.Effect.ALLOW,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects(`${props.weddingPrefix}/*`)],
      }),
    );

    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'WeddingBaseUrl', {
      value: `https://${bucket.bucketRegionalDomainName}/${props.weddingPrefix}/`,
    });
  }
}
