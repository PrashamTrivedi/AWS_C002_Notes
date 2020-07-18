---
title: Notes on VPC
---

# VPC.

- Two types of VPCs. One default and other customizable.
- Regionally isolated and regionally resiliant.
- Each VPC is isolated with each other by default. Nothing is allowed  
- VPCs are created in reagion and operates from all AZs of that region.
- Each region can have one default VPC.
- Each region can have many customisable VPC.
- Default VPC is rigid. While Custom VPCs are as name suggests, customisable.
    - Customizations inculde: IP range, multi tier VPCs, networking options etc
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
- **Target**: Target of destination, it either points at AWS Gateway or local.Value  `local` means VPC itself.



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



### Networking Refresher
- IP Networks are split in 5 classes. 
    - A Range: 0.0.0.0 to 127.255.255.255
        - 128 Class A networks can be assigned (Each Entity assigned gets 16.8 Million IPs)
        - from 0.X.X.X to 127.X.X.X
        - Alloted entities control 3 bits of Address
        - /8 in CIDR
    - B Range: 128.0.0 to 191.255.255.255
        - 16,000 networks can be assigned (Each entity gets 65,536 IPS)
        - 128.0.X.X, 128.1.X.X to 191.255.X.X 
        - Alloted Entities control 2 bits of Address
        - /16 in CIDR
    - C Range: 192.0.0.0 to 223.255.255.255
        - 256 Addresses per network
        - Alloted Entities cotrol only last bit of address.
        - /32 in CIDR
    - D & E Ranges are ignored for SAA

- Certain Ranges are allocated for private use. 
    - 1 Class A (10.0.0.0 to 10.255.255.255)
    - 16 Class B (172.16.0.0 to *172.31*.255.255)
    - 256 Class C (192.168.0.0 to 192.168.255.255)

#### CIDR (Classles inter-domain routing)
- Network Address + / + prefix (size of network.)
- Prefix of one nuber is half than prefix of the number before it.
- E.g. Prefix of 16 have double the networks than 17 and half the networks than 15s.
- Spliting a network of IPs to smaller networks using prefixes is called subnetting.
    - E.g. Splitting the range of ips of /16 to 4 networks of /18 is called subnetting.  
