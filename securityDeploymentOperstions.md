---
title: Notes on Security, Deployment And Operations
---

# Secrets Manager
- Specifically designed for storing and rotating secrets.
- Shares functionality with Parameter Store.
- Designed specifically for Secrets like passwords and API Keys.
- Usable via Consoles, CLI, APIs or SDKs.
- Supports automatic rotation of secrets using Lambdas.
- Directly integrates with some AWS products like RDS.
- Secrets are encrypted at rest.
- Secrets are integrated with IAM roles.
- Secrets are encrypted using KMS.

# Web Application Firewall(WAF) and Shield.

## AWS Shield
- **AWS Sheild provides protection against DDoS attacks**.
- **AWS shield standard comes free with Route53 and CloudFront**.
- Protections against Layer 3 and Layer 4 DDoS attacks.
- Shield Advanced- $3000 per month.
- **Shield Advanced protects EC2, ELB, CloudFront, Global Accelerator and R53**.
- **Shield Advanced gives access to DDoS response team and financial assistsnce**.

## AWS WAF
- **It's a Layer 7(HTTP/S) firewall**.
- **WAF protects against complex Layer 7 attacks/exploits**.
- **SQL Injections, Cross-Site scripting, Geolocation Blocks, Rate awareness**.
- **Main entity provided by WAF is Web Access control (WEBACL), integrated with ALB, API Gateway and CloudFront**.
- **Web ACL has rules and they are evaluated when traffic arrives**.

# Comparision and Differences.
- Both WAF and Shield filter traffic on perimiter (CloudFront, R53, ALB, API Gateway) bfore they reach to our infrastcuture.
- They can be used together in supported product.
- Sheild protects us with DDoS and Layer 3/4 attacks (Probably IP & Packet level attacks).
- WAF protects us with Layer 7 attacks and exploits and access can be controlled using WEBACL.

# Cloud HSM
- It's an appliance which creates, manages and secure Cryptographic materials or keys.
- Almost as same as KMS.
- KMS is aws managed service, isolated for you but basic infrastructure is shared between tenants.
- Behind the scene KMS use HSM = Hardware Security Module.
    - HSM are industry standard pieces of hardware which are designed to manage keys and perform cryptographic operations.
- **CloudHSM is true single tenant HSM.**
- Could HSM is provisioned by HSM but as the customers, we have to manage them ourselves. 
- AWS can't access Cloud HSM, they may access KMS if required. That means if we lose HSM, it's gone forever. We can reprovision a new HSM but the old one is completely gone.
- **Cloud HSM is fully FIPS 140-3 Level 3, while KMS is generally Level 2, and only some part is Level 3.**
- **KMS can be accessed with AWS apis and can be fully integrted with AWS services.**
- **CloudHSM can not be accessed with AWS Apis. For Access and Integration we need to use industry standard Apis like PKS#11, Java Cryptography Extensions (JKE) or Microsoft CryptoNG(CNG) libraries.**
- KMS can use Cloud HSM as custom key store. 
- They are deployed to AWS Managed CloudHSM VPC. 
- We have no visibility of this VPC.
- HSM is by default is not HA device. 
- For HA we need to have a cluster with atleast two HSM devices one each per AZ within VPC.
- HSM configured in a cluster replicate keys, policies and configuration by default.
- HSM runs in AWS managed VPC and Interfaces are added to our VPC.
- CloudHSM Client needs to be installed in every instance to access or use HSM functionality.

## Usecases and Limitations 
- **Cloud HSM does not have native integration.**.
- **Cloud HSM can offload SSL/TLS processing of webservers.**
- **Cloud HSM can enable Transparent Data Encryption (TDE) for oracle databases.**
- **Cloud HSM can protect private keys for issuing Certificate Authority (CA).**