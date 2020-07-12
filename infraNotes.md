---
title: Notes on Infrastructure
---

# Notes related to infrastructure.


There are two types of services, region based and global. Most of the services are region based, some services like IAM and Route 53 is global, region does not apply to these services.

# Regions 

- Geographic locations where all available services are deployed independently. E.G. S3 Bucket in California is different than S3 Buckets in Mumbai.



## Edge Locations

- CDN based distribution points connected to a specific region. They don't have any services deployed but they can deliver contents. 

- Nearby Edge location can be used to deliver content fastly. Like a Netflix user streaming from Vadodara or Bhavnagar can get it's content from Ahmedabad if an Edge location is available there.


## Availability Zone (AZ)

- Lower level architectural component. 
- Multiple AZs per Regions.
- Isolated infrastructure inside a region.
- Isolated compute, storage, networking, power etc..


# Resiliance

- Global Resiliant: Global services are globally resiliant. Failure in one region will not stop the service.
- Region Resiliant: They are resiliant for a region. If one AZ fails, region will continue working. If whole region fails, the region will stop working.
- AZ Resiliant: Prone to failure. If an AZ fails, a service there will fail.