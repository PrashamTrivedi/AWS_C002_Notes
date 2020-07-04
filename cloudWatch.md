# CloudWatch

- 3 Products into one
- **Metrics**: Data related to AWS Products, other products or on-premises servers
    - Some metrics are gathered natively, anything can be seen in product UI can be gathered natively by cloudwatch
- **Logs**: Any logs natively ingested (taken) by cloudwatch, e.g. Lambda logs, API logs will be logged in Cloudwatch.
- **Events**: Event logging of Cloudwatch Event changes, or scheduling.
- CloudWatch agent: For metrics gathering of service outside AWS, or generally not exposed to AWS (e.g. Process running in EC2 instance)

## Namespace

- Container for logs.
- Every AWS log namespace has `AWS/namespace` scheme, (`AWS/lambda/`,`AWS/ApiGateway` etc..). And are reserved for AWS Services only.
- For any other logging. It can be anything you want.

## Metrics

- Anything to measure is a metric.


## Datapoints

- Anything logged is datapoint.
- They have timestamp and value.
- Datapoint is logged to a metric

## Dimension

- Namevalue pair associated to datapoints. 
- Useful to identify source, or differentiate data based on source.
- Key value pair.
- Some services sends some dimensions by default.

## Alarm

- One to one relationship with metric.
- Setting alarm based on metric.
- Two states: `OK` and `ALARM`