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


