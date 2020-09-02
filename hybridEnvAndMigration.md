---
title: Hybrid Environment And Migration
---

# Border Gateway Protocol
- Protocol that is used to control how data moves from Point A throuh B and C and arrive at Point D.
- AWS products like direct connect and dynamic VPN utilize BGP.
- Made up self managing networks known as Autonomous Systems or AS. 
    - Large networks or Routers but controlled by one single entity.
    - Viewed as a blackbox, a detail which is not needed by BGP.
- Each autonomous system AS, is alocated a number called autonomous system number ASN.
    - These numbers are assigned by IANA (Internet Assigned Numbers Authority)
    - 16 bits in length and have a range (0-65535).
    - 64512-65534 are private.
    - Using ASN, BGP can identify different entities within networks. Also distinguish between different networks.
- Designed to be reliable and distributed.
- Operates over `tcp/179`.
- Not automatic: Peering is manually configured.
- It's a path-vector protocol.
    - Exchanges best path to a destination between peers.
    - The path as ASPATH (AS - PATH)
- iBGP: Internal BGP = Routing Within an AS.
- eBGP: Extarnal BGP = Routing Between two ASs.

# AWS Site to Site VPNs.
- A logical connection between VPC and an On premises network.
- Connection encrypted using IPSec, running over public network.
- **Fully HA Assuming we design and implement correctly**.
- Quick to provision, generally less than an hour.
- Virtual Private Gateway(VGW): Another Logical Gateway Object type, which can be the target on route tables. Generally reside on AWS Public Zones
- Customer Gateway(CGW): It can be logical configuration that is in AWS and the thing that it represents, a physical on-premises router which VPN connects to.  
- VPN connection between VGW and CGW.
- VGW have multiple physical endpoints, these are devices in different physical endpoints in different availablility zones, with public IPV4 addresses.
- VGW is highly available service. **The rest of site to site VPN can not be highly available**.
- A VPN connect to VGW can create two tunnels one between each endpoint and the other with physical and on-premise router.
- A tunnle is encrypted channel through which data can flow between VPC and Physical router.
- As long as one VPC tunnle is active, two networks are connected.
- If a CGW fails, whole operation fails.
- The solution is to create a new CGW, and connect them with new physical endpoints managed by same VGW.

## Static vs Dynamic VPN
- Dynamic VPN support BGP.
- The structure is VPC -> VPC Router -> VGW -> CGW
- Both type of VPNs connect in same structure.
- Static VPN uses static networking configuration, means static IPs or static CIDRs.
    - Static Routes are added to the Route Table and Static networks have to be identified on VPN connecitions.
- Static VPN is simple and it works almost anywhere.
- Static VPN doesn't offer load balancing and multi-connection failover.
- Dynamic VPNs use BGP.
    - It's configured from both AWS and consumer side using ASN and data is exchanged via BGP.
- They are high-end, highly available.
- Dynamic VPNs can be added in Route tables in AWS side statically. 
- Using `Route Propogation` means routes are added to Route Tables automatically.
- **Speed limitations of 1.25 Gbps set by aws, on the top of consumer hardware**.
- **Latency Considerations: Inconsistent Latency, more hops means more latency and les consistency, and this is decided by the public network**.
- Cost: AWS Hourly Cost, Charges for transferring data out (per GB), on premises connection charges.
- **Benifits of VPNs: Takes hours because everything is software configuration**.
- **Can be used as backup of Direct Connection**.
- **Can be used with Direct Connect**.


# AWS Direct Connect (DX)
- AWS DX is in many ways similar to Site-To-Site VPN but it's an acutal physical connection.
- A 1 Gbps or 10 Gbps network port into AWS. 
- It's just a default port operating at certain speed belongs to a certain AWS Account.
- The port is allocated at a DX location which is a major datacenter.
- If speed is 1 Gbps then we need to use 1000-Base-LX  and when speed is 10 Gbps then we need to use 10GBASE-LR standart. (Types of single mode fiber optic cables.)
- The cable connnects to our customer router (Requires VLAN/BGP).
- **In short: When we apply for DX, we're provided the ports and we need to arrange that port to plug into somewhere in that DX location and if applicable we need to arrange this setup to be transited to our permises.**
- **Because of the transition and physical connection invloved, it can take days or even months to connect.**
- Over one DX there are multiple Virtual Interfaces (VIFs).
- Each VIF is a VLAN and BGP connection between DX router and our router.
- Private VIF: connected with Virtual Private Gateway and connected to a single VPC. 
    - As many private VIFs as we want over one single DX.
    - Each private VIF connects with one individual VPC.
- Public VIF: connects with public services.
- No HA, because everything relies on a single cable.
- **No encryption by default.**
- **DX port provisioning is quick, but cross connection takes longer**.
- **DX extension to premises takes longer**.
- Use VPN first, then move slowly to DX when provided and keep VPN as backup.
- **DX is faster, using aggregation it can use upto 40 Gbps.**.
- **DX is a separate connection from our internet and do not use public internet, so it provides lower latency consistentnly**.
- **DX is not hidden from outside world**.
- When using IPSEC VPN over public VIF, the data can be encrypted by default, and it can have latency and consistency benifits of DX.


# Transit Gateway (TGW).
- Network Transit hub that connects VPCs to on premises networks.
- Designed to reduce network complexity.
- Single network gateway object - HA and scalable unlike other network gateway objects.
- Attachments are created to connect Transit Gateways with other network types/objects.
- VPC, Site-to-site VPN and Direct Connect Gateway are valid attachment types.
- Support Transitive Routing, everything and anything connected with Transit Gateway can talk with each other without any extra configuration.
- Can be used to create global networks. 
- Transit Gateways can be peered with other Transit Gateways of same/different accounts or same/different regions.
- Transit Gateways can be shared with other AWS accounts using `AWS RAM (Resource Access Manager)`.
- With TGW, network settings are much less complex.


# AWS Storage Gateway 
- A virtual storage appliance which is designed to run within an existing virtual environment either on-premisis or in data center.
- Extend file or volume storage into AWS.
- Allows extending capacity on AWS.
- Allows keeping volumes locally and their backups in AWS.
- Migrate Tape Backups to AWS.
- Allows us to migrate existing infrastructure to AWS.
- Runs in three main modes.
    - Tape Gateway mode (VTL mode). 
        - This configures storage gateway to look like tape drive, library and a tape shelf.
        - Stores virtual tapes in [S3 and Glaicer.](./s3.md#s3glacier)
        - Active tapes are stored in S3 for quick access and archival data is stored in Glacier.
        - Tapes can have size of 100 GiB to 5 TiB.
        - 1 PB storage can be configured locally and unlimited number of tapes can be archived to Glacier.
    - File mode 
        - Lets us create File shares and offers them using SMB or NFS.
        - File storage baked by S3 objects.
    - Volume Mode (Gateway Cached/Stored)
        - Storage Gateway presents block storage
        - Like [EBS](./ec2.md#ebs) but running on Premises.
        - Block storage backed by S3 and EBS snapshots.
        - Volume Gateway Stored:
            - Starts with local storage gateway on premises.
            - Has local storage and upload buffer.
            - Can create upto 32 volumes in total.
            - Each volume can have 16Tb in size.
            - Primary copy is on premise.
            - Backup happen asyncronously and backed up as EBS snapshots.
            - Ideal for migrations and disaster recovery and continuity.
        - Volume Gateway Cached:
            - Primary data is stored in AWS.
            - Frequently stored data is cached locally.
            - Ideal for extending storage to AWS.
            - All the other details are same as Volume Gateway Stored.

- Storage gateway communicates AWS via HTTPS using a public endpoint.
- Objects transferred via storage gateway are visible in S3 just like regular uploads. 
- Lifecycle policies can be applied on them and they can be transferred to different classes.


# Snowball/Edge/Snowmobile
- Designed to move large amount of Data Into and Out of AWS.
- Physical Storage Devices, either in suitcase or truck.
- Order from AWS as empty, load the data and return. OR
- Order from AWS with data, empty the data and return.

## Snowball
- A Device which we order from AWS, Log A Job and get the device delivered.
- Encryption at rest using KMS.
- 50 TB or 80 TB storage Capacity.
- 1 Gbps (RJ45 1Gbase-TX) or 10 Gbps(LR/SR) network is required where snowball is being delivered.
- **10 Tb to 10 Pb economical range data using multiple devices.**
- **Multiple devices delivered to multiple premises.**
- **Only Storage**

## Snowball Edge
- **Both Storage and Compute**.
- **Larger Capactiy compared to snowball**.
- 10 Gbps (RJ45), 10/25 Gbps(SFP), 45/50/100+ Gbps (QSFP+). 
- Storage optimised, 80TB,24v CPU, 32 Gb Ram,1 TB SSD (with EC2).
- Compute optimised, 100 TB+ 7.68 NVME storage, 52v CPU and 208 GB ram.
- Compute optimised with GPU.
- Snowball is older generation. 
- **Ideal for remote sites or where data processing on ingestion is needed.**

## Snowmobile.
- Portable Data Center within a shipping container **on a truck**.
- **Literally a truck, delivered to premises**. (Whoa emoji...)
- Specially ordered from AWS. Not available everywhere.
- **Ideal for single location where 10PB+ data is required**.
- Upto 100PB per snowmobile.
- This is driven to our location and expects to connect with our resources for data transfer.
- **Single track, not economical for <10 PB migration or multi site migration**. 


# AWS Directory Service.

## Directory in General.
- Provides Managed Directory, a store of users, objects and other configuration.
- Directories store identity and asset related information. 
    - Like users, groups, computers, servers, file shares etc with a structure like domain = inverted tree.
- Multiple trees can be grouped into a forest.
- Commonly used in windows environments.
- Sign-in to multiple devices with same username/passwords provides centralized management for assets.
- E.g. Microsoft Active directory domain service (AD DS) or open-source SAMBA.

## AWS Directory Services.
- AWS Managed implementation of directory service.
- Private service: Runs within VPC.
- Provides HA when we deploy this into multiple AZs.
- Windows EC2 instances can be part of directory, by using the directory and signin feature.
- Some AWS Services (Like AWS Workspace) require directory services.
- Can be isolated directory within AWS.
- Can be integrated with existing on-premises system.
- Can be in Connection mode where it proxies connection back to on-premises dictionary.

## Directory Mode
- Simple AD Mode:
    - Cheapest and simplest way.
    - Standalone opensource directory based on Samba 4.
    - Provides lightweight compatibility with AD DS.
    - Two different sizes: Upto 500 users for small and upto 5000 users for large size.
    - Anything can join SAMBA can join Simple AD mode directory.
    - Designed to used in isolation.
    - Can not connect with On-Premises system.
- Managed Microsoft AD:
    - When you want to have direct presence inside AWS but also have on-premises directory. 
    - Architecturaly it's similar to Simple AD.
    - Can create a trust relationship with existing on-premises directory.
        - A trust relationship creation needs to occur in private networking.
    - Resiliant. Even if VPN fails services in AWS can still access local directory.
    - Full microsoft AD DS running in 2012 R2 mode.
    - Can directly support any appliction which require AD DS services.
- AD Connector mode:
    - Only a proxy.
    - Establishes a connection between services requiring Directory services and on premises directory using a private connection.
    - Consider this as a pointer pointing to on-premises directory over private network. This pointer is used by services in AWS.
    - It's only a proxy.
    - If private connectivity fails, AD connector mode is interrupted, thus interrupting services on AWS.

## Chosing modes.
- Simple AD should be default. 
- Move to Microsoft AD for any aws app which needs microsoft AD DS or you need trust relationship with existing on-premises AD DS.
- Chose AD Connector only if you need AWS Service which needs a directory but for any reason you don't want to store directory on cloud. Proxies to your own on-premises Directory.

# Datasync.
- Data transfer service To and From AWS.
- Used for Migrations, Data Processing, Transfers, Archival/Cost effective storage, Disaster recovery or business continuation planning.
- Designed to work at huge scale.
- Keeps metadata.
- Including Built-in data validation.
- Scalable: 10Gbps per agent (~100 TB per day).
- Bandwith limiters to avoid link saturation.
- Supports incremental and scheduled transfer.
- Supports Compression and Encryption.
- Automatic recovery from transit errors.
- AWS Service integration like S3, EFS, FSx. Also support service to service migration.
- Pay as you use. Per GB Cost of data moved.
- In NAS or SAN storage device on-premises, we install DataSync agent.
- The agent runs on a virtualization platform (Like VMVare) and communicates with AWS Datasync endpoint.
- Communitactes with NAS or SAN with NFS or SMB protocol.
- Communication of Datasync agent and AWS is encrypted in transit.

## Datasync components
- **Task**: A job within datasync. Defines what being synced, how quickly, scheduling, throttling, FROM and TO. 
- **Agent**: A software used to read and write to on premises data using SMB or NFS.
- **Location**: Every task has two location FROM and TO. 
    - Locations include Network File System (NFS), Server Message Block (SMB), Amazon EFS, Amazon FSx and Amazon S3


# FSx for Windows File Server
- Provides fully managed native windows file servers/shares.
- File Shares are unit of consumption.
- Designed for integration with Windows Environments.
- Integrates with Directory service or Self-Managed AD.
- Resiliant and HA system.
- Can be deployed with Single or Multi AZ within VPC.
- Uses ENI(Elastic Network Interface) within VPC.
- The backed uses replication, to avoid hardware failure.
- Can perform Backups, On demand and scheduled backups from AWS Side.
- Accessible using VPC, Peering, VPN or DX.
- Generally EFS is used for anything Linux (EC2 or on-premises).
- And FSx is used for anything Windows (EC2 or on-premises).
- FSx needs to be connected to a directory for user store.
- FSx can directly connect Active Directory on-premises even without AD Connector Mode.
- AWS workspace can use FSx as shared file system.
- Supports at-rest encryption using KMS and allows us to enforce encryption in transit.
- Supports Shadow copying (useful for file versioning).
- Performance:
    - 8MB/S to 2GB/S
    - 100ks IOPS
    - < 1MS latency.

## Key fetures and Benifits.
- VSS: User driven files/folder restores. Unique to FSx.
- **Native file system accessible using SMB.**
- **Uses windows permission model**.
- Supports Distributed File System (DFS). 
    - We can natively scale out file systems inside Windows Environment.
- Managed service: No file server admin.
- **Integrated with DS or Own directory**.

## FSx for Lustre.
- Managed implementation of Lustre file system - A file system designed specifically for high performance computing. 
- **Support Linux based instances running in AWS.** 
- Supports POSIX style permissions for file syste,
- Designed for use cases like: ML, Big Data, Financial Modelling.
- 100's of Gb/S throughput and sub millisecond latency.
- Scratch deployment mode: Highly optimised for short term & fast computing, but does not provide replication.
- Persistent deployment mode: Longer term, HA in one AZ and self-healing.
- Accessible over VPN or Direct Connect.
- Connected using same technologies like EFS or FSx for windows.
- Data that needs to be processed should be in File System.
- But when we link a repository like S3, data is loaded lazily into file system from repository as needed.
- Data can be exported back to repository using `hsm_archive` command.
- There is no automatic sync between FS and repository.
- File metadata stored in Metadata storage targets (MST).
- Objects are stored in Object Storage Targets (OST)
    - Each OST is 1.17TiB in size.
- Baseline performance is based on file size.
- Size: Min 1.2TiB and then in increments of 2.4 TiB.
- For Scratch: 200MB/S per TiB of storage.
- For Persistance: Three levels of 50MB/S, 100MB/S and 200 MB/S per TiB of storage.
- Burst upto 1300MB/S per TiB
 