# CS5224 Lab 1 - Priya's Wedding Gallery

This repository contains the CS5224 Lab 1 report, evidence, editable AWS architecture diagram, and the AWS CDK proof-of-concept infrastructure.

## Submission files

- `Lab1.pdf` - final submission
- `Lab1-editable.docx` - editable report source
- `diagram/priya-architecture.drawio` - editable architecture diagram using the official AWS icon library

## Infrastructure

The proof of concept is in `infra/`. It creates the S3 bucket and bucket policy described in Part 1 of the report. The source code is retained exactly as used for the submission.

```bash
cd infra
npm ci
npm run build
```

Deployment requires AWS credentials and the student ID context described in `infra/bin/app.ts`.
