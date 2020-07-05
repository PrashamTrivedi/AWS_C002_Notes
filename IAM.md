# IAM

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