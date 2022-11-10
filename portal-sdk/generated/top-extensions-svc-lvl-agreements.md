
<a name="service-level-agreement-for-deployment"></a>
## Service level agreement for deployment

As per the safe deployment mandate, all the configuration changes are treated as code changes. Consequently, they use similar deployment processes.

All changes that are checked in to the dev branch will be deployed in the following order: **Dogfood** -> **RC** -> **MPAC** -> **PROD** -> National Clouds (**FairFax** and **Mooncake**).  The following table specifies the amount of time allowed to complete the deployment.

Deployments may be delayed further than the stated SLAs due to [Critical Change Only Advisory events](http://aka.ms/ccoa ) or other issues that may pause or stop the deployment pipeline (eg hotfixes).

<a name="framework-sla"></a>
## Framework SLA

| Environment | Service Level Agreement |
| ----------- | ------- |
| DOGFOOD     |	1-2 business days  |
| RC	      | 1-3 business days |
| MPAC	      | 1-3 business days |
| PROD	      | 5-7 business days |
| FAIRFAX	  | Prod + 3 business days |
| MOONCAKE    |	Prod + 6 business days |

<a name="hosting-service-sla"></a>
## Hosting Service SLA

| Environment | Service Level Agreement |
| ----------- | ------- |
| DOGFOOD     |	1-2 business days  |
| MPAC	      | 1-3 business days |
| PROD	      | 10-12 business days |
| FAIRFAX	  | Prod + 3 business days |
| MOONCAKE    |	Prod + 6 business days |
