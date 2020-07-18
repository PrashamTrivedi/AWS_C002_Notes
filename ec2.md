---
title: Notes about EC2
---

# EC2 

- Virtualization As a Service or Infrastrcuture As a Service (IAaS).
- Virtual Machines (OS+Resources)
- Instances run on EC2 Hosts.
- **AZ Resiliant Service**: hosts are running in single AZ. 


## Shared Hosts vs Dedicated Hosts.
- Shared Hosts: Hosts are shared between customers
- Dedicated Hosts: Dedicated resources are alloted to customer, and customer is paying for entire stack.
- Shared hosts are default.


- EC2 has instance store which is temporary.
- Storage Network can connect to Elastic Block Store.
- Data Network can connect to network in one or more subnets.
- Instances run on specific host. 
    - Instance change host when
        - Host fails or taken down for maintenance. 
        - Instance is stopped and then started. (i.e. state change.)
    - Once the host is changed instance storage is lost because it stays on host.
- Instances of same type, storage and cpu architecture have high chance of being hosted in same host.


## What's EC2 is good for.
- Traditional OS + Compute server stack. That have certain requirements on stacks.
- Long Running Compute. 
- Server Style Applications 
- Either Burst or steady-state load.
- Monolithic App Stacks.
- Migrating App Workloads or Disaster Recovery.




