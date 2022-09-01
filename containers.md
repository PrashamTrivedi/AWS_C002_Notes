---
title: Notes on Containers
---

# Containers

- In normal virtualization, Copy of OS is deployed in instance and app layer is on top of OS layer

- Even though the OS is same for 6 Apps, 6 copies of OS is created instead of them being shared.
- OS can take up most of the resources leaving much less to App layers.
- Containers can be used to solve this issue, where single OS can host many containers representing App layers.
- These containers can be lightweight compared to virtualization.
- Containers are made up of layers, representing sequential commands written in container file.
  - These layers are read-only.
- When each container deployed, they are assigned additional, isolated, read-write layer corresponding to file system.
- Only runs App and Environment, they don't require full OS in isolation.
- They're isolated, so they need to expose ports to connect to the host and other entities.

# ECS (Elastic Container Service.)

- Two modes EC2 mode where EC2 instances act as container hosts. And Fargate which is serverless aws managed host.
- ECS Clusters are place where containers run from.
- ECR: Amazon's own container registry. Elastic Container registry.
- Container definition.
  - Container Definition. Defines information about container image location and what's needed by image.
  - Task Definition. Defines Security, AWS Resources, Group of Sub-container definitions.(Application or anything which is not defined by single container definition.)
    - Task Definition can contain more than one container definitions.
    - Tasks are not by default scalable.
    - Task role contains IAM Role of tasks.
  - Service Definition. Useful for scalability and high availibility.
- This whole container definition is provided to ECS cluster to run.

# Cluster Modes

## EC2 Mode

- Containers are deployed to EC2 hosts.
- Hosts management either done by ECS service or we can re-use own instances.
- We pay cost for those instances and we fully manage those instances.

## Fargate Mode

- Containers are deployed in Shared Fargate infrastructure.
- We only pay for resource we use.
- Containers have ENI which are deployed to VPC.

# Choice of EC2 vs ECS in EC2 vs ECS in Fargate

- If containers are already used. Chose ECS.
- Large Workload with Price consious - ECS in EC2.
- Large Workload with less management overhead - ECS in Fargate.
- Small/Burst workloads - ECS in Fargate.
- Batch/Periodic workloads - ECS in Fargate.
