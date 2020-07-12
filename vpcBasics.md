---
title: Basic Notes on VPC
---

# VPC Basics.

- Two types of VPCs. One default and other customizable.
- Each region can have one default VPC
- Each region can have many customisable VPC
- Default VPC is rigid. While customisables are as name suggests, customisable.
- IP Range (CIDR) of Default VPC 172.31.0.0/16. 
- Subnet has their own ip range of /20 based on number of subnets.
- Lesser the number after /, more IPs are available. For /16 they have 65,536 IPs available, for /20 they have 4,096 IPs available.
- /16 can have double IPs than /17 and can half IPs than /15. 
- IGW (Internet Gateway-Allows internet to communicate to VPC & Vice-versa), Security Group (SG), Network ACL (NACL) come pre-configured in default VPC.
- Anything deployed in Default VPC will have public IPV4 Address.

 