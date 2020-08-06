---
title: Notes on Elastic File System
---

# EFS (Elastic File System)
- Network based file system that can be within linux EC2 Instances and used by multiple instances at once.
- Implementation of NFSv4 (Network File System v4)
- EFS File system can be mounted on linux. (`/nfs/media`)
- Shared between many EC2 instnaces.
- Private service,accessed via mount targets inside a VPC.
- Can be accessed from on premises, VPN or AWS Direct Connect. 
- Uses [POSIX File System Permissions](https://en.wikipedia.org/wiki/File_system_permissions).
- For HA, a mount target needs to be available in every AZ we are operating.
- **EFS is linux only**
- **General Purpose(Default) and MAX IO Modes** Like [ebs](./ec2.md#volumetypes)
- **Bursting throughput and Provisioned throughput modes** Like [ebs](./ec2.md#volumetypes)
- **Standard and IA Storage Classes** Like [s3](./s3.md#s3objectstorageclasses)
- **Lifecycle Policies can be used** Lile [s3](./s3.md#s3lifecycle) 