---
title: Notes on Route 53
---

# Route 53 (R53)

- Registering domains.
- Host Zones and managed Nameservers
- Global service, single DB
- Globally resiliance (Data copied to all regions)
- Route 53’s DNS services does not support DNSSEC at this time

## R53 Public hosted zones
- A R53 Hosted Zone is DNS database for a domain.
- Public R53 Hosted zone is hosted on R53 for public DNS servers.
- Globally Resiliant.
    - Atleast 4 R53 resolvers are deployed in that domain.
- Created automatically when Domain is regisetered via R53. Can be created separately when domain is registered elsewhere.
- Hosts [DNS records](./dnsTypes.md).
- When used hosted zone, it's autoritative for that domain in R53.
 

## R53 Health checks
- When we have multiple records of same type and same priority, client will get IP addresses in random orders.
- R53 Health check can determine health of resources pointed by IP periodically and will return only healthy IPs.
- Health checks are separate from records but are used by them.
- Health checkers are located globally.
- Check occurs every 30 seconds by default. That period can be reduced to 10 secods at some cost.
- TCP, HTTP/HTTPS, HTTP/HTTPS with string matching.
    - In TCP: Check is to be able to establish connection within 10 seconds.
    - In HTTP/HTTPS: Check is to be able to establish a TCP connection, calling HTTP(S) endpoint and receiving 200 response within 4-5 seconds.
    - In HTTP/HTTPS string matching: Check is same as above, additioanlly body is checked and desired string to be returned within 5120 bytes.
- Two status, Healthy or Unhealthy.
- Type of checks: Endpoint check, Cloudwatch Alarm checks (react to cloudwatch alarm), Calculated checks (Checks of checks).

## R53 Routing policies
- Simple:
    - Let us configure standard DNS record.
    - Default.
    - Single Record.
    - No health checks.
- Failover
    - Two records of same name and type.
    - One primary and other Secondary.
    - Each record has associated health check. 
    - Default is primary as long is healthy, secondary is used when primary is unhealthy.
- Weighted
    - Multiple records of same name, we provide weight of each record.
    - Records are returned based on their weight in total weight of same name.
    - Load balancing, testing new version.
- Latency-based
    - Multiple records of same name, we provide region.
    - Records are returned based on their latency from source request based on lowest latency.
- Geolocation
    - Multiple records of same name, we provide location.
    - When a request happens, search is done in country, continent and default in that order.
    - If health check fails, request is passed over to higher state.
- Multi-value
    - One record, one name and multiple values.
    - No health check available.

## Public vs Private hosted zones.
- Public hosted zones are available to public internet, while private hosted zones are available only to VPCS they're associated with.


