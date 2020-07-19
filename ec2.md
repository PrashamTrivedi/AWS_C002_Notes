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
    - Superfast, but can be lost on hardware problems or when instance is moved between hosted.
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
-
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



