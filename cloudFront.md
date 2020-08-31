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

# OAI
- Origin Access Identity: Mechanism to be able to stop bypassing cloudfront. 
- When this identity is created, all edge locations can assume the identity.
- And in the origin we can add explicit allow For the OAI and other explicit allows so only CloudFront can access it.

# Lambda@Edge
- Can run lightweight lambda in edge locations.
- Adjust the traffic between viewer and origin.
- Currently only node js and python is supported.
- Only run in AWS public zone.
- Layers are not supported.
- Different time limits vs normal lambda functions.
- Viewer Request: Request Connection between customer and edge location.
    - Viewer request lambda function runs after edge location receives the request.
    - Limit: 128 MB & 5 Seconds max
- Origin Request: Request Connection between edge location and origin.
    - Origin request lambda function runs before edge location forwards the request to the origin.
    - Limit: as normal lambda & 30 Seconds max
- Origin Response: Response connection between origin to edge location.
    - Origin Response lambda function runs after the edge location receives the response from origin.
    - Limit: as normal lambda & 30 Seconds max
- Viewer Response: Response Connection between customer and edge location.
    - Viewer Response lambda function runs before the edge location sends the response to the viewer.
    - Limit: 128 mb & 30 Seconds max

- Usecase:
    - Full exclusive list in [AWS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html#lambda-examples-redirecting-examples)
    - A/B testing using viewer request.
    - Migration between s3 origins using origin request.
    - Different object based on device type using origin request.
    - Content by country using Origin request.

# Global accelerator
- Starts with two anycast IP Addresses (Multiple device can use these IP address)
    - That allows to route traffic to closest location.
- These address are conected with global accelarator edge locations.
- That makes user to connect to the nearest global accelerator edge location.
- Once traffic enters Global accelerator network, it's handled by AWS itself.
- CloudFront moves content closer to customer, only for consuming.
- Global Accelerator moves the network closer to customer, can do anything with it.
- Connections enter at edge location using anycast ips.
- Transits over AWS backbones. 
- Global Accelerator can be used non HTTP(S) traffic while CloudFront can only be used for  http/s traffic.
- Global Accelerator can't cache anything.

