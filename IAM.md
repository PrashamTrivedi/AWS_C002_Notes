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