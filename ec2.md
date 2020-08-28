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


# EC2 Instance Types 
- **General Purpose**: Default. Even resource rations.
- **Compute Optimised**: Optimised for compute operation. Like media processing, High performance computing, Machine learning, Scientific modeling, Gaming etc. More CPU in same price range compared to other categories.
- **Memory Optimised**: Processing Large in-memory dataset, some database workloads. More memory in same price range compared to other categories.
- **Accelerated Computing**: Hardware GPU, field programmable gate arrays. 
- **Storage Optimised**: Sequential and Random IO- scale-out transctional DB, data-warehousing, elasticearch, analytics workloads etc.
- All types and categories noted in one place: [ec2instances.info](https://ec2instances.info/) and it's [Github Repo](https://github.com/powdahound/ec2instances.info)
- Offician AWS instance types page, which categorised all types along with features and usecases. [Official AWS Page](https://aws.amazon.com/ec2/instance-types/)

# EC2 storage

## Type of storage
- Direct (local) attached storage: Storage directly connected to a machine (like HDD on laptop or Desktop), in case of EC2 it's a storage on EC2 host.
    - Superfast, but can be lost on hardware problems or when instance is moved between hosts.
- Network attached storage: Volumes delivered over the network. 
    - Slower, but highly resiliant and can survive failure
- Ephemeral storage: Temporary Storage.
- Persistant storage: Permanat Storage. It can live past instance lifetime.
- Exampel of Ephemeral storage is Instance Store-Physical storage attached to EC2 host.
- Example of Persistant storage: Network attache storage delivered by EBS. 

## Category of storage
- Block Storage: Volume presented to OS as collection of blocks. 
    - Structureless
    - Can be mountable & bootable like Hard Drive.  
    - Can be C: drive in windows or root volume on linux
- File Storage: Presented as file system.
    - Structured.
    - Can be mounted not booted
    - Can be secondary drives.
- Object Storage: Flat collection of object
    - Only flat structure.
    - Not mountable or bootable.
    - [S3](./s3.md) is object storage.

## Storage Performance
- IO (Block) Size
- IOPS: I/O Operation Per Second 
- Throughput: Amount of the data that can be transfered per second.

- Throuput = IO Size X IOPS


# EBS
- Allocate block storages to instances.
- Can be attached to given instance any time.
- Volumes are created in one AZ. And they are Highly available and resiliant in that AZ.
- AZ fails volume in this AZ is impacted. 
- Billing is done as GB/month based. For high performance type volume, billing can have IOPS component.
    - Regardless of instance state. Instance can be shutdown for a month but still billed for that month.
- Max 80K IOPS for instance and 64K IOPS per volume (if volume is `io1`)
- Max 2375 MB/s throughput for instance and 1000 MiB/s per volume (if volume is `io1`)
- EBS volumes support live configuration changes while in production which means that you can modify the volume type, volume size, and IOPS capacity without service interruptions.

## Volume Types
- `gp2`: General purpose SSD.
- `io1`: Provisioned IOPS SSD.
- `st1`: Throughput Optimised HDD.
- `sc1`: Cold HDD.

- SSD Based types has IOPS as dominant performance factor and HDD based types have throughput as performence based factor.
- High IOPS can be useful for DB operations or file based ops. High throughput can be useful for logs or media processing.

## GP2 Storage
- Default for almost all normal usage.
- Uses performance bucket architecture based on IOPS it can deliver.
- Starting range is 5.4 Million IOPS Credited by default. And we can increase or decrease performance based on usecase.
    - This default range is enough to have a burst perforamance of 3000 IOPS for 30 Minutes.
- Minimum 100 IOPS are credited per second and after that it increases @ 3 IOPS credit per GiB of volume upto 16,000 IOPS. 
- Default for boot volumes and shoudld be default for data volumes. 
- Good use for dev and test environments.
- 3:1 IOPS to GiB ratio.
- One GP2 Storage can only be attached to one instance.

## IO1 Storage
- 50:1 GiB ratio.
- IOPS can be controlled separately from size.
- Good for high IO requirements or latency sensitive workloads.
- Useful for hosting db. 
- Has `multi attach` feature, that enables IO1 storage to be attached to multiple instances at same time.
- IO1 is good for
    - Hosting DB
    - High IO requirements or latency sensitive workloads.
    - Short volume but High IOPS
    - IOPS controlling regardless of storage.


## HDD based storage (Both ST1 and SC1)
- Cheaper 
- Great Throughput
- 500 GiB to 16 TiB.
- Not Bootable.
- Usable for
    - Streaming data into hard-disk, without worrying about IO
    - Saving data, media processing.
    - Media conversion
    - Large amount of EBS Storage.
- Ineffecient for small read/writes. 

## ST1
- Frequently accessible high throughput data like. Analytics, data warehousing, log processing etc.
- Anything that reads or writes data sequentialy.
- Bucket Style architectuer like `GP2`. 
- Stars with 1TiB credit per TiB size.
- 40 Mp/s baseline per TiB
- Bursts of 250 MB/s er TiB.
- Max Throughput 500MB/s

## SC1
- Less frequently access.
- 12 Mp/s baseline per TiB
- Bursts of 80 MB/s er TiB.
- Max Throughput 250Mb/s

## EBS Snapshots
- Backups of EBS volumes stored in S3.
- Incremental in nature.
- First snapshot is full copy of data in volume.
- Moves data to other proper backup if you delete one incremental snapshot. Data is not lost at that time.
- Volumes can be created using snapshot. Thus snapshot makes possible to move EBS volumes between AZs or Regions.
- Restoring EBS from volume is done lazily. Mainly **not all performance benifits are available when EBS volume is created from snapshot**.
- Requested blocks are fetched from snapshots immediately. Still be lower compared to reading same data directly from EBS.
- Force read of all data immediately, useful to get all data from snapshot before moving that volume to production.
- Fast Snapshot Restore (`FSR`) to immediate restoration. Option available when creating snapshot.
    - We have to pick Snapshot and AZ where instance restore operation to be done. At the time of snapshot creation.
    - Combination of Snap + AZ is called set, We can have 50 such sets per region.
- GB-Month metric.
    - 10 GB is stored for one month is called 10 GB-Month. 20 GB stored for 15 days is also called 10 GB-Month. 
    - Billing is done for GB-Month.
    - Counts on used data Not allocated data. I.E. if backup is of 10 GB out of 40 GB volume, counting is done for 10 GB not 40 GB.




# Instance Store Volumes
- Block Storage Devices. 
- Physically connected to one specific host. 
- Highest storage volumes.
- Included in instance price.
- Can be attached **only at launch time**.
- They're ephemeral volumes = temporary storage. 
- Attached to EC2 host. 
- Lost on instance resize, move or hardware failure.
- High Performance.



# EBS vs Instance Store

## When to use EBS
- Highly available and reliable 
- Persists independently from EC2 instance. 
- Multi-Attach shared clusters of `io1` types.
- Region Resiliant Backups.
- Required performance does not cross 
    - **64,000 IOPS and 1000 MiB/S per volume**
    - **80,000 IOPS and 2375 MiB/S per instance**

## When to use Instance Store
- Value: Cost included in instance.
- Higher performance compared to EBS.
- Best for Caching.
- Stateless services.
- Rigid Lifecycle link with Storage <-> Instance. I.E. Data must be cleared once instance is removed.


## EBS Encryption
- Has At rest encryption (Just like any other disks)
- Use [KMS](./kms.md) for encryption. Either creates own managed key (`aws/ebs`) or uses customer managed key.
- CMK generates encrypted DEK which is stored in EBS volume. 
- When the EBS is mounted and used in an instance, EBS gives asks KMS to decrypt DEK.
- KMS sends decrypted DEK to EC2 Host, which stores decrypted key in memory.
- When an instance running that encrypted EBS running in that host, it used memory stored Decrypted key to encrypt and depcrypt data.
- Snapshot is encrypted with same DEK. Any restoration from the snapshot uses same DEK.
    - Unless we change CMK when creating new volume from snapshot.
- Accounts setting to encrypt EBS by default, using default CMK by default, can override using other CMK.
- Each volume (created from scratch) has it's own uniqe DEK.
- **Encrypted volume stay encrypted for lifetime. We can't change a volume not to be encrypted**.
- **OS isn't aware of any encryption, so there is no performance loss for EBS encryption**.

## EC2 Network & DNS Architecture
- Each instnace has atlease one Elastic Network Interface or ENI.
- We can have more than one ENI, which can be on other Subnet. **But all ENI should be in same AZ**.
- ENI can have properties 
    - MAC address
    - Primary IPV4 private IP from available subnet IP range. 
        - Doesn't change for lifetime of the instance.
    - 0 or more secondary private IP address. 
    - 0 or 1 public IP address. 
        - It's public for outside of VPC, inside VPC it's always private address.
    - 1 Elastic IP per private IPv4 address.
        - We can associate IP with primary interface or secondary interface.
        - When asosciation is done with primary interface it removes public IPV4 and replaces with Elastic IP.
    - 0 or more IPv6 Addresses.
    - Security Groups.
    - Source/Destination check.
- Secondary ENIs can be detached from and moved to other instances.
- Secondary ENI + MAC address  = Licensing
    - Many licensing is done based on mac addresses.
    - If we use secondary ENI's mac address for license, we can move this license to multiple instances using secondary ENI.
- Multihome ENI for management and Data.
    - Multihome = Connecting a machine to multiple networks at once.
    - Instance with two ENIs in two subnets. One for management and other for data.
- **EC2 Instance OS never sees public IPV4 address**. It has private IPV4 address, and public address is managed by [VPC](./vpc.md)
- IPV4 public address are dynamic, change everytime it changes the host. Like stopping and starting instance. 
    - To avoid this, allocate and assign Elastic IP address.


# AMI (Amazon Machine Image)
- Images of EC2. Template of instance configuration and using that template to create as many instances.
- Can be used to launch EC2 instances.
- AWS Provided or Community Provided or Marketplace Provided (can include commercial software)
- **Regional.**
    - AMI is unique per region and can only be used in region it's created.
- AMI can control permissions.

## AMI Lifecycle
- Launch
    - We create instance from existing AMIs 
    - Add EBS with them.
    - Which leads to...
- Configure
    - We add extra configuration the instance like other storage or software with license.
    - Which leads to...
- Create Image
    - Creating AMI.
    - Current snapshots of EBS is being taken and mapped to AMI.
    - Account setting is stored in AMI.
    - Which leads to...
- Launch: Launching the inscance from AMI.

- **AMI Baking:** Createing AMI from configured instance + application. Like installing wordpress on an Instance and creating AMI from it.
- **AMI can't be edited**, configuration can be changed before launching instance.
- **AMI can be copied between regions**.
- **Default AMI permission: Creator account.**


## Instance Billing methods
- On-Demand Instances
- Spot Instances
- Reserved Instance

### On Demand Instances
- Instance have hourly rate.
- Billed on seconds (60 Seconds minimum) or hourly. It's based on OS.
- Default model.
- No long-term commitment and upfront payments.
- Good for New or Uncertain requirements.
- Short-Term, Spiky or unpredictable workloads that **can't tolerate any disruption.**

### Spot Instance
- Cheapest way to access EC2 instances.
- 90% off vs On-demand.
- Spot Price is set by EC2 - **based on spare capacity**.
- We **specify max price** we pay.
- If spot price goes above max price, instance terminates.
- Good For Apps that have flexible start and end times. (Like lazy analysis).
- Apps which only make sense at low cost.
- **App need to be able to tolerate failure**.


### Reserved Instances.
- Upto 75% discount. Require Commitment.
- 1 or 3 years, All Upfront, Partial Upfront or No Upfront. 3 years have better discount.
- 3 years + All Upfront offer better discount. 
- If not paying all upfront, we have to pay hourly rate **regardless of instance running or not**.
- Reserved in region, or AZ with capacity reservation.
    - When we reserve instance in AZ, it also reserves capacity.
    - When we reserve instance in region, we can apply this reservation in all applicable instances.
- When capacity issues is there before starting up. Reserved Instance has higher priority followed by On-Demand and then Spot instances.
- Scheduled reservation.
- Good for: Known steady state usage.
- Cheapest for apps that can't handle disruption.

## Status checks and auto recovery.
- Every instance has two default checks.
- System Status Checks:
    - Loss of power, Network connectivity or software or hardware issues within EC2 hosts.
- Instance status checks:
    - Corrupt file system, Incorrect instance networking or kernel issues.
- Recovery won't work with instance store volumes. 

## Horizontal and vertical scaling.
- Scaling: System needs to grow or shrink depending on increasing or decreasing workload.
- Grow = Adding resource, Shrink = Removing resource.

- Horizontal Scaling: Require more clones to fight for republic in [Clone Wars](https://en.wikipedia.org/wiki/Star_Wars:_The_Clone_Wars_(2008_TV_series)). As easy as [ordering new clones to be generated in Kamino](https://en.wikipedia.org/wiki/Star_Wars:_Episode_II_%E2%80%93_Attack_of_the_Clones).
- Vertical Scaling: When the law is applicable only to a City, a Mayor is responsible to enforce it. When same law is applicable to state, the responsibility goes to Chief Minister (Or Governor) of state. And same law is applicable to whole nation, Prime Minister or President is responsible to enforce the law.


## Vertical scaling
- Using service with more resources.
- When load increases, we move from 2 core CPU-8GiB Storage to 4 Core CPU - 16 GiB storage and further.
    - Like `t3.large` to `t3.xlarge` and `t3.2xlarge`.
- Each resizing requires a reboot, means downtime and disruption.
- Larger instance can charge premium.
- Upper cap on max performance = max instance size available.
- No app modification required.
- Works for all apps.

## Horizontal Scaling.
- Adding more instances.
- Requires Load Balancer.
    - Load balancer randomised which instance gets incoming traffic when your customer interacts with app.
- Sessions are everything, and they needs to be split accross instances.
    - A customr looking at product, adding item to cart can both be done in different instances, but they have to be in same session.
- Requires app support or `off-host sessions`.
- No disruptuon while scaling.
- No real performance limits.
- Less expensive. No large instace premium.
- More granular scaling, limited with smaller instance available.


## Instance Metadata
- EC2 service provides data to all instances.
- Available to all instances.
- `http://169.254.169.254/latest/meta-data/` to access all instance metadata from the instance.
- 169.254 repeated, with latest meta hyphen data.
- As said [above](#ec2networkdnsarchitecture), OS does not know about public IP address. But we can query this using latest meta-data.
- **Metadata service has no authentication and it's not encrypted.**
