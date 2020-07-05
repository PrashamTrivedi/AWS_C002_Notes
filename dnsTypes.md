# Type of DNS record

- `NS`: Nameserver records. Points server for DNS records.
- `A`: For IPV4
- `AAAA`: For IPV6
- `CNAME`: For named server, like `fcmutils`.prashamhtrivedi.in.
    - `CNAME` can't point to any IP directly, they have to point to ane other records. (Moslty `A` or `AAAA`)
- `MX`: For mail servers. 
    - Can be root or other domain.
    - Can point to other `A` or `AAAA` records.
- `TXT`: Allows to add arbitary text data to domain
    - Usecase: Prove identity and ownership to external domain/service via text records matching with any passphrase with them
