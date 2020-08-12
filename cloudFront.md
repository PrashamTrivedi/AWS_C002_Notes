---
title: Notes on CloudFront
---

# CloudFront
- Content Delivery network: CDN available from AWS.
- CDN where content is Cached in location Closer to customers.
- Lower Latency and Higer throughput.
- Can handle Static and Dynamic Content.


## Useful Terms
- **Origin**: Source location of our content. Can be anything which is available on public internet and accessible from CloudFront.
- **Distribution**: The unit of configuration of CloudFront.
- **Edge Location**: Local infrastructure which host cache of our data.
- **Regional Edge Cache**: Larger version of Edge location. Provides another layer of caching.

# CloudFront continued...
- When something is requested, AWS checks edge location first, if not found there, aws checks regional edge cache, if not found there aws performs the origin fetch (where data is fetched from origin), data is stored in regional edge cache and propogated to edge location.
- Integrates with ACM (Aws certification manager) or HTTPS.
- This is for download only. Any upload is requested, happens to origin, it does not cache anything to the edge location from where it is uploaded.
- When caching is done with Query string params, it caches both object and query string parameter set. And same object can be stored multiple times for different combination of query string parameters.
    - E.G. `something.com/image.jpg`, `something.com/image.jpg?for=sharing` and `something.com/image.jpg?for=download` stores same `image.jpg` thrice for three different query parameters.
- The answer is:
    - If query parameter does not mater: Forward to origin with yes or no option, when we chose no, caching does not consider any query string parameters.
    - If query parameter maters: Use for caching option when we can chose all query strings or chosen query strings.

# ACM
- Easily provision, manage and deploy public and private certificates for use mainly within AWS Services.
- HTTP: Simple and insecure transfer
- HTTPS: SSL/TLS encryption layer included over HTTP for security.
- Data is encrypted in transit.
- Certificates prove identity of host server.
- Certificates signed by trusted authority.
- ACM can create, renew and deploy certificates. 
- Supports AWS services only, (E.g. CloudFront and ALBs not EC2)
    - If it's not managed service or self managed like EC2. ACM does not support it.
        