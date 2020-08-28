---
title: EC2 Advanced
---

# EC2 Advanced.

This is the continuation of [EC2](./ec2.md).

# EC2 Bootstraping.
- Bootstraping = self configuration.
- Bootstrapping using user data. Accessed via [meta-data api](./ec2.md#instancemetadata).
    - `http://169.254.169.254/latest/user-data/`. 
- Anything passed in user data is executed by instance os **only on launch time**.
- EC2 just passes the data and OS tries to run the data as command, **there is no validation**.
    - Except OS should be able to understand that data as runnable command.
- Userdata runs between launch state and running state. Means all user data process is done before EC2 is available for us to use.
- If there is a problem with user data. Instance is in bad config, there won't be any termination or stoppage.
- User data is not secure. Not good for long term credentials.
- Max user data size is 16 KB.
- Can modified when instance is stopped. When data is modified before instance start, new data will be available in User data, but **execution will only happen at launch**
- User data must be in base 64 when sent to EC2. Console UI automatically does that.

## Boot time to service time.
- Generally AMI launches in minutes, and post launch configuration can take time upto minutes or hours based on the configuration.
- We can bake time sensitive tasks in AMI and then use tasks which are not time-sensitive in configuration, which can reduce time significantly.


### CFN Init
- CFN Init on cloud formation template can have some data which are applied after instance creation.
- Just like user data, they can be used to apply post init scripts to instance.
- Unlike user data, CFN init can be updated and executed after instance init.

#### CFN Creation Policy and Signals
- CloudFormation is somewhat dumb. It Just creates resource as per policy, but it does not always know correct status of created resources. 
    - E.g. CFN knows Instance is provisioned but it does not know if user data is executed properly or not.
- We can use creation policy to tell stack how to wait for signal and how long to wait for it. And There is a `cfn-signal` command.


## EC2 Instance Roles
- EC2 Instances Roles are roles an instance can assume and anything in that instance can access other AWS resources according to the role.
- Instance Profile is a thing that allows the permissions to get inside the instance.
    - When instance role is created via console, an instance profile with the same name is created automatically.
    - When instance role is created via API or CFN, we have to provide instance profile separately.
- Temp credentials of assumed roles are delivered to instance from Instance Profile via [instance metadata](./ec2.md#instancemetadata).
    - Credentials are available at `iam/security-credentials/{role-name}` in meta-data response.
- Temporary credentials available from metadata is always valid, EC2 and secure token service work with each other to automatically renew the temporary credentials.
- Prefer roles rather than Access-Keys
- CLI tools use role credentials automatically.

## SSM Parameter Store (System Manager Parameter Store)
- Storage for configuration and access.
- Key value parameters.
- Three types: String, StringList and SecureString.
- Useful for License codes, DB Connection string, full config and passwords.
- Hieracrhies and versioning.
- PlainText and CipherText (Integrates with [KMS](./kms.md))
- Public parameters and private params.
- Parameter hierarchies are represented using Object notation in S3. 
    - Like `/dev/passwords` have a parameter called passwords under Dev.
- Permissions on SSM Store can be set for whole set of keys or separate parameter trees.

## EC2 Placement Groups
- By Default AWS selects EC2 hosts based on various criteria.
- EC2 Placement groups allows us to arrange instances on a physical hardware.
- Three type of groups
 

### Cluster Placement Group
- Place instances close together. 
- Highest performance 
- **All instnaces are created and locked in same AZ**.
- Best practise is to launch all of the instance in the group at same time.
- Instances run in same Rack, sometimes in Same Host.
- All instances have direct connecion to each other.
- Highest throughput and lowest latency.
- Little to no resiliance, all fail when hardware fails.
- Can span VPC Peers-but impacts performance.
- **Not all instances type are supported**.
- Best practise is to use same type of instances.
- **10 Gbps single stream performance can only be achievable in cluster placement group.**


### Spread Placement Group
- Keep instances separated
- Maximum amount of resiliance and availablility.
- Instances can be in separate AZs.
- Each Instance is localted on separate isolated rack. So instances are separated from each other by default.
- **Limit of 7 instances per AZ**.
- **Not supported for dedicated instances or hosts**.
- Small number of instances that needs to be kept separated from each other.
- Separation is handled natively by AWS.

### Partition Placement Group
- Similar architecture Sperad Placement Group.
- Instances and Partitions can be in separate AZs.
- Divided into partitions.
    - **Limit of 7 Partition per AZ**
- Each Partition is located on separate isolated racks. 
- In a partition, we can launch as many instances as we want.
- Group of instances spread apart partition. 
    - Instances in Partition A are closer with each other but separated from Instances in Partition B.
- We can either have partition selected for Instance or let AWS select this for us.
- Instances are aware of which partitions they're in.
- Not supported on Dedicated Hosts.

## Dedicated Hosts
- Host dedicated to us. 
- Designed for family of instances.
- We pay for the host, not for the instance runs.
- On demand or Reserved Option available.
- Host hardware has Physical sockets and cores.
- Host is designed for specific family and size of the instance.
    - E.g. A1 comes with 1 Socket and 16 cores. With that we can use 16 Medium,8 Large,4 xlarge, 2 2xlarge and 1 4xlarge instance.
- Most hosts require us to use same size of hosts, we can't mix and match size like 8 medium and 2 xlarge instances.
- Latest hosts with nitro virtualization enabled (Like R5) allow us to mix and match size. Upto the dedicated host capacity.
- Pricing details are [here](https://aws.amazon.com/ec2/dedicated-hosts/pricing/)
- **AMI Limits**: Can't use SUSE, RHEL and Windows AMIs on dedicated hosts.
- **Amazon RDS instances are not supported**
- **Placement groups are not supported**
- Hosts can be shared with other Organization accounts using RAM (Resource Access Manager) product.
    - Owner of host can see all instances running on the host, can't control.
    - Other accounts of the organization can only see instances they create.

## Enhanced networking and EBS Optimized instances.

### Enhanced networking
- Uses SR-IOV (Single Route IO Virtualizatoin) = NIC (Network Iterface Card) is aware of virtualization.
- Available on Most EC2 types without additional charge.
- Higher I/O and lower CPU usage and more bandwidth.
- Higher Packets per Second.
- Consistent Lower Latency.

### EBS Optimised Instances.
- EBS is block storage over the network.
- Historically network is shared between regular app data and EBS. That adds load on network.
- EBS Optimised means dedicated capacity for EBS.
- Most instance support and have enabled by default.
