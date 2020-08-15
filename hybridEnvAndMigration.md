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

