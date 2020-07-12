---
title: Notes on Cloudtrail
---

# Cloudtrail

- Almost anything that can be done to an AWS Account is logged by cloudtrail
- 90 days of event history is stored by default. Anything else needs to be customised.
- Regional Service, logs event for region it's created in(By default).
- **One Region Trail**: Trails events of region it's created in.
- **All Region Trail**: Trails events of all regions. (Collection of trails of all regions.)

- Global service always trails their event to us-east-1. Trail needs to have global service events enabled to be able to log Global Events.
- IAM, STS (Security Token Service), CloudFront log Global Service Events. 

- **No Real Time Data**. There is some delay, within 15 minutes. 

- Two types of cloudtrail events Management events and Data events.


## Management Events
- Events of management operations of resource
    - E.G.: EC2 Instance created, S3 Created/Deleted
- A.K.A: Control Plane operations.
- CloudTrail logs only management events by default. 

## Data Events
- Resource operations performed in or on resource
    - E.G.: Objects uploaded to S3, Lambda Invoked.

## CloudTrail storage
- Can be stored in S3 or in cloudwatch.
- In S3 data is stored in compressed JSON format.
- 