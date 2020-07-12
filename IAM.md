---
title: Notes on IAM
---

# IAM

- IAM users are identity used for anything requiring long term access. E.g. Humans, Apps 


- Rules applied in this priority order
    - Explicit Deny
    - Explicit Allow
    - Implicit Deny

- If you don't do anything, default mode is implicit deny. All AWS Non Admin access are Implicit Deny by default.
- If you allow anything via IAM policy, it's explicit allow, **unless you're explicitly denied** something via IAM Policy.

## Inline vs Managed Policies
- Two main types of policies, Inline policies and managed policies.

- Inline policies: Policy JSON **created and applied individually for all entities**. That means multiple copies and multiple association.
- Managed policies: Policy JSON **created once and applied to all entities together**. That means single copy and multiple associations.

- Managed policies for whole org. And Inline policies are for specific additional rights or denials.


## AWS Managed Policies vs Customer managed policies

- AWS manages some default policies
- We create policies that fit our need.

## IAM Policies Vs Resource Policies
- IAM Policies are attached to principals, Resource policies are attached to resource.
- IAM Policies dictate what a principal can access, Resource policies dictate who can access the resource.
- IAM Policies are only attached to principals of your own account, Resource policies can allow or deny own account or other account.
- IAM Policies are attached to a principal thus anonimity is not possible. While Resource policies can allow/deny anonymous principals.
- Resource Policy has Principal value attached to it, can allow which principal is allowed/denied this resource. IAM Policy doesn't have this principal value.


## Authentication vs Authorization

- Authentication: A principal claims to be an entity with valid credentials and should be able to prove this using valid mechanism.

- Authorization: What grants are given to authenticated identity.

## IAM Limits

- 5000 IAM Users per account. 
- One user can be part of max 10 groups.
- 300 Groups/account (soft limit)
- No limit on no of group members


## IAM Groups

- Groups are container for users, they don't have own credentials. 
- No automatic or native group: There is no group which has all users by default. We have to manage it ourselves when need is arised.
- Groups are flat, they are not nested.

- Resources can have their own policies and they can mention user ARN which has access or denial to that resource. These policies can not mention groups. 

# IAM Roles

- Roles are temporary access mechanisms. 
- Used when more than 5000 users or multiple principals whose number is not known while designing. 
- IAM Identities represents person, app or service (a.k.a Principal) while role represents level of access.

## Policies of IAM roles.
- Trust Policy and Permissions Policy
- Trust Policy Controls which anonymous usage, principals or identity provider can assume the role
- Permission policy controls what grants this role can have.
- Based on trust policies when an Identity is able to assume the role, allowed identity gets temporary credentials which expire after certain period of time. After expiry, identitiy needs to re-asssume that role.


# Service Control Policies

- They apply to Organization, Operational Units or Accounts in that organizations.
- SCP means which policies can be allowed or denied. They are not actual grants.
- Master account of organization is not affected by any SCPs. It's allowed everything.
- Default SCP is full aws access.
- The grants applies to a login is overlap of User's IAM grants and grants allowed from SCP.
    - E.G.: If SCP allows S3,ElastiCache and EC2 Access and IAM allows S3,RDS and EC2 access, user can only use S3 and EC2. 
    - Though user can use RDS by IAM grants, but SCP has implicit deny on RDS user can't use RDS when accessing through organization.
    - Same way user can use ElastiCache by SCP grants, but IAM has implicit deny on ElastiCache user can't use ElastiCache.
