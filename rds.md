---
title: Notes on RDS.
---

# RDS
- Database Server as a Service.
- We consume database server, and anything below that (OS, networking and hardware stack etc..) is handled by aws.
- RDS Gives us Managed Database instances which can hold one or more DB.



## Types of No Sql Databases
- Key value storage: They're just a key value storage where keys are unique (e.g. Redis)
- Wide Column storage: The table has definite keys structure, values can be different in given table, but all values in given table must follow same key structure. 
    - E.g. In dynamodb each keys have Partition Key + Sorting Key schema, we can omit sorting key, but when we have both, each values in tables should have both data.
- Document Based Storage: Like key-value storage but values are full JSON(or XML) documents. (E.g. MongoDB)
- Column Based Storage: In SQL we store whole rows into a table, which is good for transaction. Column based storage stores whole data based on columns, which is good for analytics and reporting. (E.g. Amazon Redshift)
- Graph Storage: Can be like SQL. But in SQL, relations are stored at key level (Foreign keys or mapping tables), which makes querying relational data slower. In Graph Storage, relations are stored fully and not separately and with additional meta-data. Thus making queriying relational data faster.

## What are the valid reasons to put DB in EC2 instances?
1. Need DB Instance OS. (There is no real requirement for many of the cases)
2. Advanced DB Option tuning and root level access to DB. (In AWS managed DBs, many options are available)
3. Vendor demands. (Refer point 1)
4. DB or DB Version requirement not provided by AWS managed products. (OK, now it's valid reason).
5. Specific DB + OS requirement which AWS Provides (Also a valid reason).
6. Specific resiliance or replication requirements which AWS may not provide (Again, another valid reason).
7. Decision makers demand it. (Refer Point 1).

## Problems with DB in EC2 instances.
1. Admin Overhead, managing instance and host.
2. Backups and DR management is complex and not automated.
3. Not enough [resiliance and high availability](./HA_FT_DR.md)
4. AWS managed database provide a lot of features which are not possible in DBs in Instances.
5. Problem in scaling, and missing serverless advantages.
6. Performance, the optimisation used by aws in managed products is not available in DBs in instances.

## RDS DB Instance.
- When creating a DB instance, we already have one DB and can create other DBs as required.
- We can access DB using DB Cname.
- Pricing: Allocated GB/m and storage and memory like instance.

## RDS Multi AZ
- When we create RDS instance, we have an option of Multi AZ.
- When we select multi AZ, a standby replica of DB is created. 
- RDS Enables syncronous replication from Primary to standby replica.
- When we access RDS using CNAME, it defaults to Primary instance. 
    - **There is no way we can access Standby Replica or There is no way standby replica can be used for extra capacity, it's just there sitting and accepting syncronous replication.**
- Syncronous replication
    - Write: When we write something to DB via CNAME.
        - DB Writes that data to the EBS volume
        - Parallelly DB sends the same write request to Standby Replica, which writes to its local storage.
        - 0 Leg.
- When primary instance fails CNAME records redirects to standby replica.
    - **The interruption of this operation is between 60 to 120 Seconds.**
- **No free tier**: Extra cost for standby replica. **Twice the price**.
- This feature is **for same region only**.
- **Backups are taken from standby replica, that means no performance impact on Primary Instance.**
- Type of outages on primary instance
    - AZ Outage
    - Primary Failure
    - Manual failover (To do some operations on Primary which may make Primary Instance unavailable)
    - Instance Type change on primary
    - Software Patching on primary

## RDS Backups and restores
- Automated backups and manual backups.
- Both use AWS managed S3 Buckets, which won't be visible to console, API or CLI.

## RDS Monitoring
- RDS' default metrics are for Instace which is used to host RDS. It gives us the metrics of the instance, not the Database itself.
- To get metrics related to Database, we need **RDS Enhanced Monitoring**. 
- Enhanced monitofing will export to cloudwatch in JSON format, which is stored for 30 days, can be changed with `RDSOSMetrics` log group.

## IAM DB Authentication
- Can authenticate DB with AWS IAM.
- **Availabe only with MySQL and Postgres**.

### RTO vs RPO (Recovery Time Objective vs Recovery Point Objective)

#### RPO
- Time between last backup and the failure incident.
- Amount of maximum data loss.
- If RPO value is less, cost can be more expensive.
    - E.G. If a databackup occurs at midnight, and a failure occurs at 3 PM we have loss of 15 hours and if the backup fails it can be more than 24 hours.
    - Lowing RPO means more backups, can be more expensive.

#### RTO
- Time between failure and full restoration
- Influenced by available hardware, poeple and system. That includes speed of generating new hardware, availability and knowledge of people performing restoration and systems helping them to do the restoration.
- Lower the RTO means more expensive operations.
    - That includes standby hardware.

## Automated Backups
- They happen automatically in some intervals.
- First backup is full rest are incremental.
- Backups occur during backup window we define.
- Database transaction logs are stored in S3 **every 5 minutes**. **That can reduce RPO to 5 minutes.**
    - **It restores DB to the last snapshots and any transctions are logged will be replayed in DB.**
- They are not reatained indefintely.
- Backups are retained for max 35 days.
- They can outlive main RDS but the maximun 35 days limit still apply.



## Snapshots
- Manual and have to run them against RDS instance.
- Works like [EBS Snapshots](./ec2.md#ebssnapshots)
- First backup is full rest are incremental.
- When snapshot is occured, there is an interruption on flow of data between source and storage.
- They don't expire. They remain past RDS instance.

## RDS Restore
- Creates new RDS Restore - new address.
- If snapshots are restored, they are restored in snapshot creation time.
- Restoration is not fast, RTO can be highly impacted.

## Read Replica
- Read only replicas of RDS Instances
- Unlike standby replicas which can't be used for anything. Read replicas can be used for read-only operations.
- Sync is done using **asycnronous replications**.
    - Primary source will write incoming data fully in disk.
    - When the disk writing is completed, data is being replicated to read replicas.
- Can be in same region, or can be in multiple region (AKA Cross Region).
- When cross region read replica is used, AWS handles all networking, fully [encrypted in transit](./encryption.md)
- 5 Dedicated read-replicas per DB instance, providing additional instance for read operations.
- So primary instances can be used for write operations and others can be used for read operations, reducing the load.
- Read-Replicas can have their own read-replicas, but **they introduce problemetic lag amount**.
- Global Performance improvements.
- **Offer near 0 RTO**.
- Can be promoted quickly to read write instance.
- Also replicate failures.
- Once read replicas are promoted to Read write instances, it can not be reverted back to read-replicas.



# Aurora Architecture
- Part of RDS, but distinct from normal RDS.
- Uses a Cluster.
- Single Primary Instance + 0 or more replicas.
    - These replicas can be read during normal operation. Mixes Multi AZ + Read replicas.
- No local storage of instance, instead it uses shared cluster volume.
- Aurora Cluster can function across number of AZ.
- SSD Based storage. 
    - High IOPS and Low Latency.
- Max 64 TiB.
- Has 6 Replicas and available across multiple AZs.
- Syncronous Replication happens at the storage level.
- Storage system is much more resiliant than RDS. 
    - It can automatically detect and repair storage corruption.
    - It can fastly restore the data from other replicas.
- Aurora can have upto 15 replicas and any of them can be a failover target.
- Storage is billed based on **what's used**.
- High Watermark: Billed for most used. 
    - E.G. If we store 20 GB today, we will be billed for 20 GB in current month, even if we removed 10 GB in an hour. We will be billed for 10 GB for next month if it's max storage.
    - If we needed 5 GB tomorrow, we can also re-use that storage.
- Replicas can be added and removed without requiring storage provisioning.
- Unlike RDS, Aurora Cluster have multiple endpoint. 
- Cluster Endpoint and Reader Endpoint.
    - Clustre Endpoint always points to primary instance, used for R/W Operations.
    - Reader Endpoint points to read-only replicas, and if there are multiple, load balancing happens.
- We can also create custom endpoints.
- Each instance have their own unique endpoints.
- **No Free tier option**.
- Beyond Single AZ, Aurora offers better value compared to RDS.
- Compute: Hourly charge, per second, 10 minute minimum.
- Storage: GB-Month consumed, IO Cost per request.
- 100% DB Size in backup are included in cost.
- Backups works same way as RDS
- Restore creates a new cluster.
- Backtrack can be use as a in-place-rewind to a previous point in time. Reduce RPO and RTO. 
    - Need to enable per cluster base.
- Fast Clone makes a new DB: Much faster than Copying all the data. It stores the difference.


## Aurora Serverless
- We don't need to provision resources like aurora provisioned.
- It uses ACU (Aurora Capacity Units)
- We create a cluster and provide min and max ACU and cluster scales up and down based on these values and load.
- ACU can go down to 0 and can be paused, when done that, we only pay for storage.
- Consumption billing per second basis.
- Same resiliance as Aurora Provisioned.
- ACU are allocated from AWS hot pool, they don't have their own storage. They use cluster storage.
- New ACUs can be allocated when load increases and any old ACUs which are unused can be de-allocated from cluster.
- Connections are done with shared proxy fleet, which is transparent to us.
- Use Case: 
    - Infrequently used applications.
    - New Applications.
    - Variable workloads.
    - Unpredictable workloads.
    - Dev and Test DB.
    - Multi-Tenant Apps.

## Aurora Global
- We can replicate Aurora Globaly from Master region to 5 secondary regions.
- Master region can have 1 read/write and 15 read only replicas, while secondary region have all 16 read only replicas.
    - All of those can be promoted to r/w.
    - RPO and RTO are low.
- Replication occurs at storage layer, happens within 1 second on primary region.
- Usecase
    - Cross-Region disaster recovery and business continuity.
    - Global read scaling- low latency performance improvements.

## Aurora Multi-Master writes
- Default mode
    - Single master
    - 1 R/W 0+ read replicas.
    - Cluster endpoint for write, read endpoint is load balanced.
- Multi-Master all instances are R/W.
- App is responsible to connect all/one write db. There is no load balancing.
- When one instance has write operation it tries to write to all storage available to all masters.
- Storage can accept or reject the operation.
- Replication also done to other master's read only memory.

## DB Migration Services
- A managed DB Migration service.
- Runs using replication instance.
    - Runs 1+ replication tasks, where all configuration is defined.
    - We need to provide source and destination endpoints pointing to Source and Destination db.
    - Atleast one of those must be on AWS.
- Three types of JOBS.
    - Full Load: one time migration of whole data
    - Full Load + CDC (Change Data Capture): After full load finished, it replicate changes between two.
    - CDC Only migration: Uses external tooling for full load and use DMS for CDC.
- DMS does not do schema conversion. Schema conversion tool is used.
- No or little downtime.