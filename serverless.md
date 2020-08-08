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
