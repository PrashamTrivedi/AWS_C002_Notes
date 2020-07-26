---
title: EC2 Advanced
---

# EC2 Advanced.

This is the continuation of [EC2](./ec2.md).

# EC2 Bootstraping.
- Bootstraping = self configuration.
- Bootstrapping using user data. Accessed via [meta-data api](./ec2.md#instancemetadata).
    - `http://169.254.169.254/latest/user-data/`. 
- Anything passed in user data is executed by instance os **only on launch time**.
- EC2 just passes the data and OS tries to run the data as command, **there is no validation**.
    - Except OS should be able to understand that data as runnable command.
- Userdata runs between launch state and running state. Means all user data process is done before EC2 is available for us to use.
- Is there is a problem with user data. Instance is in bad config, there won't be any termination or stoppage.
- User data is not secure. Not good for long term credentials.
- Max user data size is 16 KB.
- Can modified when instance is stopped. When data is modified before instance start, new data will be available in User data, but **execution will only happen at launch**
- User data must be in base 64 when sent to EC2. Console UI automatically does that.

## Boot time to service time.
- Generally AMI launches in minutes, and post launch configuration can take time upto minutes or hours based on the configuration.
- We can bake time sensitive tasks in AMI and then use tasks which are not time-sensitive in configuration, which can reduce time significantly.
