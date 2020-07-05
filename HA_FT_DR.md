# High Availibility, Fault Tolerance and Disaster Recovery

## High availibility (HA)
- High availibility means ensuring agreed level of uptime, for higher than normal period.
- Some disruptions are allowed, like re-logging in, some level of (recoverable) data loss etc.


## Fault tolerance (FT)
- Enables the system to continue operating properly in the event of failure of some (or more) components.
- Often includes extra or duplicate components so that when one fails, other can keep running.

### Difference between HA and FT
- HA means maximizing uptime, and FT means operate through failure.
- HA means you should be able to replace faulty server with working one, and FT means your frontend should continue working while backend is being replaced.
- HA is less severe problem, FT is much complex.
- HA is like changing a punctured tire of car, and FT is like extra engine in a plane.

- Mission critical systems must be Fault Tolerant. While regular systems can only go till the High Availibility Zones

## Disaster Recovery
- Set of policies, tools and procedures to enable recovery or continuation of vital components and infrastructures following a disaster. 

- Disaster recovery includes backups, moving things, people and knowledge to different locations and making recovery as smooth and fast as possible.
