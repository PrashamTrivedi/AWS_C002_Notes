---
title: NO SQL and Dyanamo DB
---

# DynamoDB
- NoSQL, Wide Column, Db As service.
- Key/Value & Document.
- Public service, can be accessed from public internet or in VPC, internet gateway or Gateway VPC endpoint.
- No self-managed servers or infractructure to worry about.
- Full control when we scale in and out manually or based on rules. Or on-demand mode when service decides when to scale in or out based on loads.
- Highly resiliant... Across AZs and if configured globally as well.
- Data is automatically replicated to multiple nodes.
- Really Fast and data is given within single digit miliseconds.
- Handle Backups, allows point in time recovery and data is encrypted at rest.
- Event driven integration ... Do things when data changes.


## DynampDB Tables.
- Table is grouping of items sharing primary key.
- Simple Primary Key or Partition Key and Composite key: Combination of Partition Key and Sorting Key.
- All items in the table must have primary key, and they must have unique values.
    - For Partition Key, all values in partition keys must be unique.
    - For Composite Key, combination of Partition Key and Sort Key must be unique.
- Item can max be 400Kb in size. (Include PK, Attribute Keys and Values).
- We configure a table with provisioned capacity or on-demand capacity.
- Here capacity means speed.
- Adding capacity means adding more speed and performance.
- On-demand capacity means we don't have to set explicit values of capacity. We pay cost per operation.
- On Provisioned Capacity we need to set two values per table.
    - Write Capacity Units (WCU): 1 WCU = 1 KB per second write operations.
    - Read Capacity Units (RCU): 1 RCU = 4 KB per second read operations.

## DynamoDB on demand backups
- Full copy of table retained until manually removed.
    - Restoring to copy data accross regions.
    - With or Without indexes
    - Adjust encryption settings.
- Point-In-Time Recovery.
    - Disabled by default.
    - When enabled, it results continuous stream of backups. 
    - Records all the changes of table over a 35 day window.
    - Restoring it to a new table for 1 second granularity.

## Consideration
- **No SQL: Prefer DynamoDb in Exam.**
- **Relational Data: No DynamoDb.**
- **Key/Value: Prefer DynamoDB.**.
- Access via CLI, Console, API.
- Billed based on RCU, WCU, Storage and Features.

# Operations, Consistency and Performance.
- Two modes: On Demand and Provisioned.
- We must choose one when creating a table, and can change it (in some cases) even after data is added.
- On Demand: 
    - Unknown and unpredictable load and usage, and requires no Admin Overhead.
    - Price: Per million read and write Units.
- Provisioned:
    - RCU and WCU are set on a per table basis.
- **Every operation consumes atleast 1 RCU/WCU, even if data written or read is less than the size mentioned.**
- **1 RCU = 1 X Max 4 KB read operation per second.**
- **1 WCU = 1 X Max 1 KB write operation per second.**
- Every table has RCU and WCU burst pool (300 seconds).

## Query Operation
- Accepts a single Primary Key values and based on value passed as argument, returns data based on that value.
- Capacity consumed is size of all returned items.
- Anything we filter is discareded based on what we passed in response, but we are still chared for whole item because the whole item is read first and then filter is applied.

## Scan Opration
- SCAN moves through a table **consuming capacity of every item in a table**. 
- But it's more flexible to get results.

## Consistency Modes for Read operations.
- Two types of consistency modes. Eventual and Strong.
- Consistency modes denote how acurately the data will be returned as soon as it's written.
- In eventual consistency mode, the data will be eventually consistent. 
    - This mode scales well.
- In strong consistency mode, data will be almost immidiately consistent.
    - This mode is costly, and doesn't scale well.
- Every piece of data is replicated multiple times in separate AZs.
- Each AZs have a storage nodes.
- One of the storage node is dynamically chosing a leader.
- Write is always directed at leader node.
- Leader node replicates data to other nodes, the operation usually takes milliseconds.
- Generally 1 RCU read is 4 KB per second, but it's a strongly consistent mode read.
- In Eventually consistent read 1 RCU is 8 KB per second.
- In eventually consistent read, dynamo db redirects requests to one of the nodes, where data may not be replicated yet, thus it can be stale, but eventually (in short span of time) data will be fresh. But it will be scalable because any number of nodes can be used.
- Strongly Consistent read always read from the leader node. And becuse of leader rigidity, this operation is costly and not scalable.
- Not every app or access types tolerates eventual consistency, we should select appropriate model based on our usecase.


# DynamoDB Streams and Triggers.
- Time orderd list of Item changes in a table.
- 24 Hour Rolling window of changes using [Kinesis](./serverless.md#kinesis).
- Enabled per table basis. Disabled by default.
- Records Inserts, Updates and Deletes.
- Different View types influcene what's in the stream.
- Four View Types:
    - Keys Only: 
        - Records only partition (and sort) key for the item which is changed.
        - Whatever is interrogating this change will be determinig what has changed.
        - Useful to notify that some item has changed (without notifying what has changed).
    - New Image:
        - Records entire item with the state it was after the change.
        - Useful to notify and operate under new data.
    - Old Image:
        - Records entire item with the state it was before the change.
        - To calculate what has changed to get old data from stream and latest data from table.
    - New and Old Images: 
        - Records both Old image before the change is done and New image after the change is done.
        - Independent calculation of what has changed.

## Triggers
- Events can take place on stream changes.
- Event driven(i.e. Serverless) architecture to react on data change.
- Item Changes generate an event.
- Event contains the data (based on view type) which changed.
- Actions can be take based on using that data.
- Lambda can be invoked when something is changed in stream.
- Reporting & Analytics.
- Aggregation, Messaging & Notifications.


# Dynamo DB Indexes.
- Indexes are way to improve data efficiancy operations within DBs.
- Query is most efficient operation in DB
- **But Query only works on 1 PK Value at a time. (And optionally multiple sort keys)**
- Index are alternative views on data.
- Two types of Index. Local Secondary Index (LSI) and Global Secondary Index (GSI)
- **LSI = Create view using different Sort Key.**
- **GSI = Create view using different Partition Key and Sort Key.**
- **For both of indexes we have ability to chose from some or all attributes from base table.**

## LSI.
- LSI is an alternative view for a table.
- **Must be created with a table, can't create LSI after base table is created.**.
- 5 LSIs per table.
- **Alternative Sort key on table.**
- **Shares the RCU and WCU with the table.**
- Attributes: All, KEYS_ONLY, INCLUDE (which lets us chose which attributes are projected into index.)
- Indexes are sparce. Only items which have a value in the index alternative sort key are added in the index. Items not having value in the index alternative sort keys will not be added in the index.

## GSI
- **Can be created at anytime.**
- **Default limit for 20 per base table.**
- **Let us define a different Partition and Sort Keys.**
- **They have their own RCU and WCU capacities.**
- Attributes: All, KEYS_ONLY, INCLUDE (which lets us chose which attributes are projected into index.)
- Indexes are sparce. Only items which have a value in the index alternative sort key are added in the index. Items not having value in the index alternative sort keys will not be added in the index.
- GSI are always eventually consistent. Replication between Base and GSI are asyncronous.

## LSI & GSI Considerations.
- Careful with Projections.
- Queries on Attributes not projected in indices are expensive. We use another query for that, increases RCUs.
- Recommends using GSI as default, use **LSI only when strong consistency is required.**
- Use indexes for alternative access patterns.

# Global Tables.
- Global tables provide multi master replication.
- Tables are created in multiple regions and added to the same global table.
- When same data is written to two different tables, the most recent table that has written the data will win when conflict arises.
- Reads and Writes occur to any region.
- Globally sub-second replica between regions.
- Strongly Consistent Reads only in the same region as writes.
- Provides Global HA, and Global Disaster Recovery and Business Continuation.

# DynamoDB Accelarator (DAX)
- DAX is a in-memory cache (like redis) that integrates directly with DynamoDB.
- Opreates from VPC, designed to be deployed to multi AZ.
- Cluster service: Nodes are placed to different AZs.
- One is a primary node where all read and write operation happens. Others are read only replicas.
- DAX SDK is required to read data from DAX, DAX SDK will try to read data from cache, if not found fetch it from DynamoDB and stores in cache before responding with result.
- Item Cache: Caches individual item and is used when `getItem` or `batch` operations are called.
- Query Cache: Holds results of Query or Scan operation along with the parameters it's called with.
- Write through caching is supported: Data is written into cache as the same time as being written into database.
- If Cache Miss occurs data is first written to primary node and then replicated to other nodes.
- In DAX primary node writes and replicas read.
- DAX is HA, when primary fails, one of the replicas are promoted to read via election.
- In memory cache, must faster reads with reduced costs.
- Scale up(Bigger DAX instances) or Scale out(More DAX Instences).
- DAX is not public AWS service. Any app using DAX should be deployed in VPC.

# Athena
- Serverless Interactive Querying Service.
- Take data, store in S3 and perform Ad-Hoc queries on data.
- Pay only for data consumed.
- Athena uses Schema-On-Read - Table like translation on original data.
- Original data never changes, they remain on S3.
- We define schema in advance.
- When read from S3, Athena translates the schema when it reads in flight like relational tables.
- Output of this query can be sent to other AWS services.
- Supports XML, JSON, CSV, TSV, AVRO, PARQUET, ORC, Apache Logs, CloudTrail Logs, VPC Flowlogs etc...
- Inside Athena we define schema, and inside schema we define tables.
- Tables define how to get format of original source data to table structure.
- Schema is like a recipie of how to get original data to present it our way using tables.

# ElastiCache
- In memory DB for high end performance.
- Used for high throughput temporary data.
- **Managed Redis or Memcached as a service.**
- **Can be used to cache data for read heavy workloads, with low latency requirements.**
- **Reduce expensive DB workloads**.
- **Can be a place to store session data for stateless servers.**
- **Requires code changes to support two reads (From Cache and optionally DB), and two writes (To Cache and DB Both).**

## Redis vs Memcached.
- Both are used in Elasticache. Offer wide language support and offer sub-millisecond access to data.

## Memcached
- Memcached supports simple structures like string.
- Memcached doesn't support replication.
- Memcached uses multiple nodes (Sharding).
- Memcached doesn't support backup.
- Memcached is multi-threaded by default.

## Redis
- Redis supports advanced structures like string, list, hashes, sets, bitarray etc.
- Redis supports replication of data across multi AZs.
- Redis supports read-replicas.
- Redis supports Backup & Restore.
- Authenticate the users using Redis AUTH by creating a new Redis Cluster with both the `--transit-encryption-enabled` and `--auth-token parameters` enabled.