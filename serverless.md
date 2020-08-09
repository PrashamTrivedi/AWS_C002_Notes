---
title: Notes on serverless architecture
---

# Monolithic Architecture
- In monolithic architecture every component is on single instance.
- The instance capacity = max capacity needed for an opration. E.g. If our app has A,B and C components and C requires max CPU (4 GB Ram) and B requires max storage(10 Gb storage), our instance should have minimum CPU that meets C's CPU requirement and B's storage requirement. i.e. min instance must be 4+ gb ram and 10+ gb storage.
- That is not scalable because when we need to scale, we need to scale entire stack (4+ Gb Ram and 10+ Gb storage).
- The option is tiered application, i.e. each component A, B and C live in their separate tiers. i.e. instance of A can have 1 Gb ram and 5 Gb storage, instance of B can have 1 Gb ram and 10 Gb Storage and instance of C can have 4 GB ram and 2 Gb storage.
- Tiered instance must have one to one connection with each other and they need to be constants.
- We can scale instances using Load balancers. 
- It's not possible to shut down every instance of one component even if the component is not used.

# Event driven architecture
- Compoents can have different requirements and communicate with each other using event buses.
- Everything is an event, i.e. button click, API Calls, Object stored in Bucket etc...
- Producers produce events and Consumers consume events.
- Producers deliver messages to event buses and event buses deliver messages to consumers.
- Consumers terminate themselves when there are no more messages to process.

# AWS Lambda
- Function as a service.
- Event driven execution.
- Piece of code in one language and one runtime.
- Only billed for a duration of function runs.
- Key component of Serverless architecture.
- Container, that has function code, runtime environment
- Uses execution role (IAM Role)
- Invocation is event driven or manual. 
- When invoked, the code and additional info is downloaded in a compute hardware managed by aws.
- Lambda can never run, run once or many times. Runs in one compute instance, runs in many paralleley.
- Never store anything environment.
- Public service by default.
- They can access public resources by default. 
- They can be configured to be inside private VPC. When they're inside private VPC they can't access public resources.
- Max 15 minutes execution time.
- 1Million Free request per month and 4,00,000 GB-Seconds of compute time per month are free.

# Cloudwatch Events & Eventbridge
- Cloudwatch events is an old architecture, eventbridge is superset of cloudwatch and is recommended.
- They both observe events (Eventbridge can accept events from third parties). And send messages to receivers.
- Both have default event bus for an acount.
- Cloudwatch event has only one event bus. Eventbridge can have additional buses.
- Event rules that looks for a pattern defined by us and when the pattern is found, it delivered to the target. Pattern matching + schedule rules.
- Rule recipients can have one or more targets.


# API Gateway
- Managed AWS Service.
- Manages API Endpoint services.
- Create, Publish, Monitor and Secure APIs.
- Billed based on API Calls, Data Transfers and additional features such as caching.

# Serverless Architecture
- Serverless is not a hardware acrhitecture, there is always a server running. But not all the components of app are hosted in single server/set of servers, they are all separated.
- It's all about management. In serverless architecture, developers, admin and management care about 0 servers, sometimes a few when required. 
- App is collection of small & specialized functions.
- Stateless and Ephemeral environments. Envs don't have their own state, and they are temporary esp they stop when they're done.
- Billing is done as duration.
- Event driven: Nothing is running unless it's required.
- FaaS(Function as a service) is used where possible for compute.
- Managed Service (Like S3 and RDS) when possible.


# SNS
- Highly available, secure, durable pub/sub messaging service.
- Public AWS service. Network connectivity with public endpoint.
- Co-ordinate sending and delivery of messages.
- Messages <=256 KB 
- SNS Topics are base entity of SNS
- SNS Topics have permissions and configuration of sending those messages.
- Publisher sends a message to topic.
- Topics have subscribers which receive messages.
- Subscribers include: HTTP(S) endpoints, Emails, SQS, Mobile Push, SMS and Lambda.
- Used across AWS for notification. Cloudwatch Alarms and CloudFormation 
- Offers Delivery Status- Some supported types like SQS, Lambda or HTTP(S) endpoints can send delivery status back to SNS.
- Delivery retries.
- Highly Available and Scalable services.
- SNS is regionally resiliant.
- Capable of Server side encryption.
- Cross account access via topic policy.

# Step Functions
- Step Functions lets us create state machines.
- State machines as service. State Machines have start, steps and end.
- Each step is capable for receiving a data, do work on that data and output a data.
- By using step function a lambda can increase it's running duration.
- Standard workflow and Express workflow.
- Maximum duration is 1 year for Standard, 5 minutes for Express
- Started via API Gateway, IOT Rules, Eventbridge, Lambda etc...
- States are defined as Amazon State Language (ASL). It's a JSON Template.
- State machines assume IAM Role for permissions.
- States:
    - Succeed & Fail
    - Wait: Wait for certain period of time and waits till certain point in time.
    - Choice: Different path based on input.
    - Parallel: Multiple execution at same time.
    - Map: Accepts list, and executes something based on item of that list.
    - Task: Allows the state machine to actually perform task.
        - Can be integrated with different AWS Services.

# SQS
- Managed message queues.
- Standard and FIFO queues.
- In FIFO Queue messages are receievd in order.
- In Standard Queue messages can be received out of order.
- Message size max 256 KB.
- Received messages are hidden for a period of time (Visibility time out). 
- After visibility timeout if client hasn't deleted the message from queue, this message can re-appear at later point of time or retried immediately.
- Dead Letter Queues, message fails multiple times can be moved to separate queue.
- [ASGs](./loadBalancing.md#autoscalinggroups) can be scaled using length of queue 
- In standard queue message can be delivered atleast once. 
- In FIFO queue message can be delivered exactly once.
- FIFO 3000 messages per second with batching and 300 messages per second without.
- Billed based on Request, message received by SQS via sender.
- Short polling and Long polling.
    - Short polling logs a request and pulls the queue immidiately. Even if there is no messages we're billed.
    - In long polling we can wait for a period (Upto 20 seconds), if messages are available they will be delivered, if not they will wait.
- Encryption at rest is supported using KMS.
- Encryption in transit (Between SQS and clients) is supported by default.
- Identity policy can be used for accessing Queue from same account.
- Queue Policy can only be used to allow access to different account.

# Kinesis
- Kinesis is a scalable streaming service.
- Desined to ingest a lot of data from lot of producers.
- Producers send data to Kinesis Stream.
- Streams can scale from low to infinite data rates.
- Public service and highly available by design.
- Streams store 24 Hour moving window of data.
    - Any data which is older than 24 hours old will be replaced by new data.
- Multiple consumer access data from that moving window with granular time control.
    - i.e. one consumer can access real time data, one can access one data per hour.
- Kinesis start with one shard. And based on performance requirements can add multiple shard.
- Shard Capacity is 1 MB/Second Ingestion and 2 MB/Second Consumption.
- More shard = more cost.
- Another costing factor is window. 24 hr is default and given and can be increased upto 7 days. More storage window is required, more cost is there.
- Data is stored in Kinesis Data Record which have maximum 1MB size.
- Data Firehose can be used to pass Kinesis data into other AWS Service like S3.

# SQS vs Kinesis
- Large throughput or large number of devices - Choose Kinesis.
- Worker pool decoupling or syncronous communication - Choose SQS
- SQS has usually 1 producer group, 1 consumer group. 
- SQS has no persistance and no time window.
