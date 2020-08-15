---
title: Notes on VPC
---

# VPC.

- Two types of VPCs. One default and other customizable.
- Regionally isolated and regionally resiliant.
- Each VPC is isolated with each other by default. Nothing is allowed.
- VPCs are created in reagion and operates from all AZs of that region.
- Each region can have one default VPC.
- Each region can have many customisable VPC.
- Default VPC is rigid. While Custom VPCs are as name suggests, customisable.
    - Customizations inculde: IP range, multi tier VPCs, networking options etc
- Default VPC can be recreated.
- IP Range (CIDR) of Default VPC 172.31.0.0/16. 
- Subnet has their own ip range of /20 based on number of subnets.
- Lesser the number after /, more IPs are available. For /16 they have 65,536 IPs available, for /20 they have 4,096 IPs available.
- /16 can have double IPs than /17 and can half IPs than /15. 
- IGW (Internet Gateway-Allows internet to communicate to VPC & Vice-versa), Security Group (SG), Network ACL (NACL) come pre-configured in default VPC.
- Anything deployed in Default VPC will have public IPV4 Address.
- VPC CIDR Range minimum /28 (16 IP) and Max /16

- Custom VPC Default vs dedicated tenancy.
    - Default Tenancy: Shared Hardware. Later on it can be changed per resource
    - Dedicated Tenancy: Dedicated Hardware. Locked in for a lifetime of the VPC. Costlier than default.

## DNS in VPC
- Provided by [Route 53](./route53.md)
- VPC `BASE + 2` Address. (E.g. Base VPC Address is `10.0.0.0` then DNS is `10.0.0.2`)
- `enableDnsHostNames`: Whether instances in Public VPC are given public host names or not. 
- `enableDnsSupport`: Whether DNS is enabled or disabled on VPC.



## VPC Subnets
- A Subnetwork of VPC withhin a particular AZ.
- AZ Resiliant, Subnet is created in one AZ and it can never be changed.
- AZ has many to one relationship with Subnets. 
    - One subnet can only be in one AZ
    - One AZ can have 0 or more subnets.
- Two subnets of one VPC can communicate with each other.
- 5 IPS are resereved in each subnet. `10.16.16.0/20`
    - First address(e.g. `10.16.16.0`) is a network address. 
    - `Network Address + 1` (e.g. `10.16.16.1`) is a VPC router.
    - `Network Address + 2` (e.g. `10.16.16.2`) is reserved by AWS for DNS
    - `Network Address + 3` (e.g. `10.16.16.3`) is reserved for future use.
    - `Broadcast` address, which is last address in range. (e.g. `10.16.31.255`)
- DHCP (Dynamic Host control protocol). That's how computing devices receive IP Address automatically.
    - One DHCP configuration applies to one VPC and this applies to all subnets.
    - DHCP configuratoins can not be edited. We have to create new DHCP config and applied to VPC.
    - Auto Assign public IPV4 option, if checked it will automatically assign public IP address of IPV4 type.


## VPC Router.
- Every VPC has one VPC router
- It's highly available. 
- Routes traffic between subnets.
- Controlled by route tables, and each subnet has one router.
- Main route table is subnet default.
- Subnet can has only one route table with it. But one route table can be associated with multiple subnets.
- When IP Packet (A Packet contains source, destination and data) leaves Subnet, router table is used.
- Entry in destination is matched with destination source of IP Packet.
- On multiple matches, entry with local route is matched first, for anything else entry with higher prefix value is matched.
    - Like for following scenario
        - **IP Packet**: `src:{whatever}`,`destination:10.160.32.255`,`data:{whatever}`.
        - **Routing Data**: 
            - `10.160.32.0/30` has setting A. 
            - `10.160.0.0/16` has setting B and 
            - `0.0.0.0/0` (Public access) has setting C. 
        - In this case setting A is applied because this entry is more narrowly downed to IP, indicated by higher prefix.

### Routing table.
- **Destination**: Destination denoted by IP CIDR. 
- **Target**: Target of destination, it either points at AWS Gateway or local. Value `local` means VPC itself.



## Internet Gateway
- **Regionally resiliant** gateway attached to VPC.
- One to one relationship between VPC and Internet Gateway. 
    - One VPC can have 0 or 1 Internet Gateway
    - One Internet Gateway can be attached to 0 or 1 VPC.
- Gateways traffic betwen VPC and Internet or AWS public zone like (S3, SNS, SQS etc...)
- Managed by AWS
- Private Addresses can communicate with internet using NAT (Network Address Translation)
- When something (Like EC2 instance) has public IPV4, that entity does not "have" a public IPV4. An entry of that entity's private IPV4 is mapped in Internet Gateway with a public IPV4 address.



## Bastion Host/Jumpbox
- An instance in public subnet.
- Incoming management connections arrive here, then access internal only VPC address.
- Bastian Host/Jumpbox/Jumpserver is only way IN to VPC.


## NACL(Network Acceess control list)
- Controls any request that crosses the subnet boundry. Like a firewall which can filter traffic that enters or leaves the subnet.
- Rules are proceessed in order. Lower number of rule is applied first.
- When rule is matched, action (Allow/Deny) is taken and processing stops.
- Fields: Type, Protocol, Port Range and Source (For inbound rule) or destination (for outbound rule).
- If all fields are matched, then that rule is matched. If multiple rules are matched, the rule with lower number is applied.
- Two default NACL rules
    - One with * rule, which explicitly denys everything and can never be edited. This applies if no other rule can be applicable.
    - The other rule, which is 100 rule, explicitly allows everything. This rule can be edited or deleted.
- NACL are stateless: It sees INITIATION and RESPONSE part of same communication as different streams. That forces us to add two separate rules.
- NACL only activates when data crossed subnet boundry. If data is not crossing subnet boundry, no rules are applied.
- NACL only supports IPs, networks, ports & protocols. It can not operate on AWS logical resources by default.
- **NACL can only be assinged to subnets and nothing else.**
- NACL are only networking entity that can explicitly deny anything.
- One Subnet can only have one NACL. 
- Each subnet has default NACL, if we apply any custom NACL, default one unapplies, and if we remove any custom NACL, default one reapplies automatically.
- One NACL can be applied to multiple subnets.

## Security Groups
- Almost every AWS service has a network interface attached with it. Communication is done via that network interface.
- Security Groups are attached to that given network interface instead of subnet. I.E. Security groups are attached to AWS services.
- Security Groups are stateful. They can see INITIATION and RESPONSE part as same communication.
    - Inbound rule of same communication is automatically applied to outbound rule. No need to set two rules.
- In security group we can mention AWS resource. 
    - AWS Resources, other security groups and themselves.
    - E.g. Default security group mentions itself as inbound security rule which allows incoming traffic. Means anything attached to this security group can communicate freely with each other.
- Security Group has default implicit deny. If not mentioned anything it denies the network. NACL does not have hidden denies.
- Security Group can't explicitly deny. NACL can.
- That can create a problem. Like if we allow **all incoming traffic for tcp on port 443 (which is https), we can't deny any bad actor connecting through https**. For that we can use NACL to explicitly deny before the bad actor tries to enter subnet.
- NACL on subnet for any product which don't work with Security groups. Like NAT Gateway.
- **Rule Of Thumb**:
    - Use security groups everywhere, except.
    - The resources (Like NAT Gateway) don't support them or.
    - We want to explicitly deny a bad actor (bad IP or bad user).
    - In above cases we have to use NACL.


## NAT (Network Address Translation) Gateways
- Process of giving private resource outgoing only access to the internet.
- A set of process which remaps source or destination addresses.
- `IP Masquerading`: Hiding whole IPV4 CIDR behind one public IPV4.
- Useful for giving private CIDR giving outgoing only internet/public aws zone access.
- Runs from a public subnet.
- Use Elastic IPs.
- AZ resiliant, and highly available there.
- For region resiliance, NAT Gateway needs to be deployed in each AZ. And route table in for each AZ with that NAT Gateway as target.
- Chargable: Hourly charge per NAT Gateways. And data processing charge per GB.
- There can also be NAT Instance. An EC2 instance configured specially for NAT. ANd for that we need to disable `source/destination checks`. Otherwise any data for which, that instance is neither source or destination, will be dropped.
- NAT Instances are not as highly available or highly resiliant as NAT Gateways. But they're lot cheaper compared to NAT Gateway. 
- NAT Instances are regular EC2 instances so we can use them as Bastion Hosts (Jump servers) or use port forwarding there. NAT Gateways does not have this level of management. Everything there is managed by AWS.
- NAT Instances can use Security Groups as well as NACLs, while NAT Gateways only use NACLs.
- **All IPV6 Addresses inside AWS are publically routable**.

# VPC Flow Logs
- Essential diagnostic tool for complex networks within AWS.
- Capture packet meta-data, not packet contents.
- For pokcet contents we need packet sniffer.
- When Applied to VPC: Applied to all network interfaces of that VPC.
- When Applied to Subnet: Applied to all network interfaces of subnet.
- Can be applied to interfaces directly and only this interface will be monitored.
- Flowlogs are not realtime.
- Can be configured for Cloudwatch or S3 Destinations. Read more about their trade-offs [here for s3](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html) and [here for CloudWatch](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-cwl.html)
- To and From Meta-data apis (169.254.169.254), 169.254.169.253, DHCP, Amazon DNS Server and Amazon Windows licence logs are not covered.

# Egress only Internet Gateway
- Only allows connection to be initiated from inside a VPC to outside.
- IPV4 addresses can be private or public.
- NAT Gateway only allows IN connections: Allows public services to send messages via NAT Gateway to private instances in EC2 instance.
- IPV6 allows all IPs as public. Can be routable to and from public internet.
- Egress only is outbound ony for IPV6. It allows the connection to be initiated from private instances and get response back, but it doesn't allow public internet to connect to private instance.
- Egress only gateways are HA by default across All AZs.
- It scales based on traffic flowing through it.
- We need to configure Route Tables to configure default IPV6 route of `::/0` to flow with Egress only internet gateway as target.
- Egress only Internet Gateway works with IPV6 only.

# VPC Endpoints

## Gateway Endpoints
- Provide private access to support AWS services like S3 and DynamoDb.
    - Means private only respource inside a vpc or any resource inside private VPC to access supported aws services directly.
- We create a gateway endpoint, the endpoint is created per service, per region.
- When we allocate a gateway endpoint to a particular subnet, a prefix list added to route table of that subnets that uses gateway endpoint as target.
- The prefix list is kept updated by AWS.
- The network request having prefix list exists to public sservice via Gateway Endpoints and not via Internet Gateway.
- Highly available across all AZs by default.
- Endpoint policy is used to control what can be accessed.
- It's regional only. Can't be used for cross regional services.
- Using gateway endpoints we can restrict S3 Buckets to be accessed only from given private VPC. So these bucket can't be leaked.
- Gateway endpoints can be only accesed from the VPC, anything outside that VPC can't access Gateway endpoint of that VPC.

## Interface Endpoints
- Just like gateway endpoints, interface endpoints provide private access to public services. 
- Interface Endpoints provide access anything but S3 and DynamoDB. These are both handled by Gateway endpoints.
- They are not highly available by default, they're added to subnets 
- For HA, we need one Interface Endpoint to one subnet in each AZ.
- Network access can be controlled via Security Groups. Which is not availabe in Gateway Endpoints.
- Just like Gateway Endpoints, Endpoint Policies decide what can be accessed via interface endpoints.
- Interface endpoints work with TCP and IPV4 only.
- Interface endpoints use PrivateLink technology.
- PrivateLink will be helpful to inject any third party services into private VPC without additional network admin overhead.
- They primarily use DNS.
- Endpoint provides new service endpoint DNS.
    - Regional DNS names: Works with AZ to access the service, highly available and simple.
    - Zonal DNS: One specific interface in one specific zone. 
- Apps can use given DNS or..
- Use `PrivateDNS`: Associate R53 private hosted zone with VPC. Overrides default DNS name.

# VPC Peering
- Private, direct and encrypted network link between two VPCs.
- One connection links two and only two VPCs.
- Connections can not be transitive.
    - i.e. If VPC A is peered to VPC B and VPC B peered to VPC C, there is no direct implicit connection from VPC A to VPC C. 
    - To connect VPC A and VPC C, they have to be explicitly peered.
- Works in same or cross region and same or cross accounts.
- (Optional) Public hostnames in peered VPCs can resolve to private IP addresses.
    - Means we can have same DNS name to locate services whether they're in peered VPCs or not.
- Same region Security Groups can reference peer Security Groups.
- We create a logical gateways in both VPC.
- Routing configuration is needed, Security Groups and NACLs filters are still applied. 
- IP Address CIDR for two VPCs invloving in Peering can not overlap.