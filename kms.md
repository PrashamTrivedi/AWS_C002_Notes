---
title: Notes on KMS (Key management service)
---

# Key Mangement Service.

- Regional and public service.
- Create, store and manage cryptographic keys.
- Keys never leave KMS, all operations are done in KMS.
- It's **FIPS** compliant service, FIPS 140-2 L2. (FIPS is US Security standard).

## Customer Master Key
- Logical Key: Contains ID, creation date, Key policy, Description and State.
- CMK is backed by physical key material.
- CMK can encrypt or decrypt max 4KB of data directly.
- CMK are never stored when not encrypted. KMS takes CMK and encrypt it before storing to physical disk.
- AWS Managed vs Customer Manged: AWS Managed CMK are automatically created by AWS when a service uses KMS. Customer managed CMK are created when customer create/import keys.
- Customer Managed keys are much more configurable.
- AWS managed keys are always rotation enabled and rotation happens on every 1095 days, while for Customer managed keys, it can be optional and rotation can be done once a year.
- CMK contains, current backing key and previous keys changed by rotation.
- Aliases can point to CMK.
- All CMK has a key policy. 
- Customer managed CMKs can have policies adjusted.

## Data Encryption Key
- DEK are generated by KMS using CMK (Customer Master Key).
- DET can work on data more than 4KB.
- KMS Doesn't store or use DEK. It's provided to us or any service and then discarded.

