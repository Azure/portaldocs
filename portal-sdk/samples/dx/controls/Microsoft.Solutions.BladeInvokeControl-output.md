
## defaultValue before selecting different option

```json
{
    "diskSizeGB": 8
}
```

## after selecting different diskSize: for example, 16GiB

```json
{
    "sku": "Premium_LRS",
    "diskSizeGB": 16,
    "iops": 120,
    "throughput": 25,
    "maxValueOfMaxShares": 3,
    "ultraReadOnlyValues": {
        "minRoIops": 10,
        "minRoThroughput": 10,
        "maxRoIops": 4000,
        "maxRoThroughput": 2000
    },
    "defaultPerformanceTier": {
        "minSize": 8,
        "maxSize": 16,
        "tier": "P3",
        "maxIops": 120,
        "maxThroughput": 25,
        "maxValueOfMaxShares": 3,
        "maxBurstIops": 3500,
        "maxBurstThroughput": 170
    }
}
```
