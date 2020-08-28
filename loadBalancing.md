---
title: Notes about load balancing
---

# Load Balancing
- Without load balancing, we either connect with single server which is prone to failure or connect with a long living DNS resolvers which are not optimal
- With load balancing, we connect with Load Balancer, load balancer lisetes for certain protocols with a listener.
- Load Balancer in turn, keeps connections with the servers configured with it. 
- Without load balancers, it's clients' responsibility to keep a connection with helthy servers, and clients are not good in doing this.
- Load balancers can maintain own health checks, and keep/stop connection when required.
- **The client is not aware about existence of any load balancers.**
- **Clients don't directly connect to server, they connect to LB**
- **Their primary point of contact is LB's listener (Configuration to read port and protocol)**.
- **LB connects one or more Target**
- **Used for [Hight availability, Fault Tolerance](./HA_FT_DR.md) and Scaling**

# Application Load Balancer (ALB)
- Legacy Load Balancer or Classical Load Balancer (CLB): Simple load balancer in earlier days of AWS
- Application Load Balancer: Advanced Load Balancer improved on CLB
- Network Load Balancer: Recently introduced Load Balancer 
- Family of all 3 LBs are called Elastic Load Balancers (ELB)

---
- Layer-7(OSI 7-Layer architecture) Load Balancer, understand HTTP/S.
- Scalable and Highly Available.
- Internet-Facing or internal. (If nodes of ALB has public ip address then it's internet facing, otherwise internal).
- Listeners on Outside, forwards connection to the target(s).
- Standard Hourly Rate and LCU (LoadBalancer Capacity Unit) rate.
    - One LCU: 
        - 25 new Connection/Second
        - 3000 active connection/minute
        - If target is EC2 instances 1 GB/hour
        - If target is lambda 0.4 GB/hour
        - 1000 rule evaluation/second

---
- ALB has atleast one node configured per AZ.
- Each node gets 100%/number of nodes. 
    - Means two nodes will receive 50% each
    - 5 nodes will receive 20% each etc.
- Cross Zone Load Balancing.
    - Node in one AZ can distribute it's load to target in other AZ in addition to target of it's own AZ.

### ALB Targets
- ALB Targets include: EC2 instances, ECS, Lambdas, EKS(Kubernetes sevice).
- Supports HTTPS, HTTP/2 and Websockets.
- Uses SNI (server Name Indication) for multiple SSL Certificates to the LBs.
- Targets are grouped within Target Groups, and each target can be part of more than 1 target Groups.
- ALB redirects connections to targets using rules.
- Rules: Host rules or path rules.
    - Host rules: Using host name (Subdomain) to use given target. 
        - E.g. `media.organization.com` will access a specific set of media server(s) and `blog.organization.com` will access another set of servers where blog database and app is stored.
    - Path rules: Using path to use given target.
        - E.g. `organization.com/media` will access a specific set of media server(s) and `organization.com/blog` will access another set of servers where blog database and app is stored.

## Launch Configuration and Templates
- Allow us to define configuration of an EC2 inatance in advance.
    - AMI, Instance Type, Storage, Key Pair, Networking and SGs, UserData and IAM Role.
- None of these are editable, define them once. Launch Template can have versions.
- Launch Template provide new features.
    - Newer type of instances.
    - Placement Groups.
    - Capacity Reservations.
- Launch Tempaltes are recommended by AWS.
- Launch Configurations are used by Autoscaling groups.
- Launch Templates can also be used by Autoscaling groups, but they can also be used to launch instances directly from console or CLI.

## Auto Scaling Groups
- We configure Auto Scaling Groups to configure EC2 to scale automatically based on criteria we set.
- Auto Scaling and self healing for EC2.
- Use Launch Template or Launch Configuration
- They use exact one Launch Configuration or one version of Launch Template at a time. They can be changed but Auto Scaling Group can not have more than one LC or more than one version of LT at a time.
- Has a minimum capacity, desired capacity and max capacity. 
- Provision (Upto max level) or Terminate(Upto min level) instances to keep the desired level.
- Provision and termination can be done manually or automatically using **scaling policies**.
- ASG tries to distribute in all AZs
    - E.g. When our desired need is 6 targets, and we have three AZs, ASG tries put two targets in each AZ.
- Three types of scaling policies
    - No Scaling: Manual
    - Scheduled scaling: Scale up or down based on time
    - Dynamic Scaling: Three subtype
        - Simple Scaling: Based on metric: 
            - E.g. When CPU Load above 70% add one instance. 
            - And when CPU load below 30% remove an instance.
        - Stepped Scaling: Almost same as simple scaling but granular control: 
            - E.g When CPU load is above 50% add one instance, between 50-60% add two instances and above 70% add three instance. 
            - And when CPU Load below 60% remove one instnce. Between 40-60% remove two instances and below 40% remove three instances
            - Almost always prefered to simple scaling.
        - Targeted Scaling: Let us define ideal amount of something. When we define it, group will scale automatically to stay at that amount.
- Cooldown period: How long to wait (in seconds) between two scaling actions. 
- Self healing: When an EC2 instance fails, instance notifies to ASG and ASG instructs to provide brand new instance in place of failed instance.
- Trick to HA: Define an instance with launch template, create an ASG with min max and desired target as 1. When EC2 instance fails, it can launch another instance in same AZ and if it's not possible in another AZ. Thus there will always be one instance available.
- ASG instances can be automatically added or removed from target groups, thus automatically configured with ALBs.
- ASG can use load balancer for health checks. ALB can have richer application level checks compared to EC2 checks and using that ASG can add or remove instances.
- **ASGs are Free, we only pay for resources we consume using ASG**.
- **It's recommended to use smaller instance in ASG for more granularity**.
- **For anything client facing, use ALB with ASG**.
- **ASG Defines When and Where to launch something, LT defines what to launch**.


# Network Load Balancer
- NLB are Layer 4(OSI 7-Layer architecture) Load balancers: They only understand TCP and UDP (Only network layer components)
- **NLB Can't understand HTTPS**, but they are faster and **give less latency**.
- NLB can also load balance TCP:80 (which is HTTP) or TCP:443(Which is HTTPS).
- **Highest performant of load balancer family, they process millions of request per second**.
- **1 Network Interface with static IP address per AZ, can use Elastic IPs(useful for whitelisting)**.
- **Can Do SSL Passthrough**.
- **Can also load balance other than HTTP/S request**.

## SSL Offload.
- Three ways where Load Balancer can handle SSL connections
- Bridging
    - Default mode for ALB.
    - Listener is configured for HTTPS. 
    - SSL Connections occur between client and ELB.
    - Decryption is done in ALB, and based on decrypted data, another encrypted session between ALB and target is established.
    - Load balancer needs SSL Certificate matching with domain name for incoming collection.
    - AWS needs to know about certifications.
    - Matching SSL Certificates need to be located in EC2 instances so encryption can happen there.
    - Good: 
        - All the positives of ALB added with https.
    - Bad:
        - ALB and all EC2 instances have the copy of SSL Certificate, which may not satisfy some requirements.
        - Compute is needed to encryption/decryption.
- Passthrough
    - Client connects and NLB passes this secure connection to an instance.
    - Instances need to have SSL certificate installed, but Load balancer doesn't.
    - Listener is configured using TCP, so no encryption and decryption happens on NLB.
    - Good:
        - AWS can not access certificates, satisfy some requirements which bridge method can not.
    - Bad
        - Not useful for ALB, only NLB can perform such actions.
        - Instances still need to have compute for encryption/decryption.
- Offload
    - Client connects to LB and LB encrypt/decrypt the data related to client.
    - There is no encryption from LB to target. The data is passed in plaintext.
    - Certificate is required in load balancer, but not required in EC2. 
    - Good: 
        - No compute required = smaller instances and cost effectiveness.
        - Plaintext traffic never leaves AWS, thus security problems can be dealt with.
        - Any type of load balancer can be used.
    - Bad:
        - AWS needs to be aware about SSL certificate. Same issue as Bride mode.

## SSL Session Stickiness
- Without session stickiness, whenever user is switched from one instance from other, any session data (login, cart progress etc) is lost.
- Session Stickiness is for help.
- Enabled on target group.
- First time a request is made, AWS generates a cookie called AWSALB in client seesion. 
- We define cookie duration. 1s to 7 days.
- This cookie locks the connection to single backend instance for cookie duration.
- This connection changes in one of the two scenarios.
    - The backend instance fails.
    - The Cookie expires.
- When connection changes, cookie is being renewed and new connection is established using different instance, and this instance keeps the new connection.

