<a name="in-product-feedback"></a>
# In product feedback

Feature-based feedback surveys are used to measure customer effort score (CES) and customer value add (CVA).  Based on the Gartner model, CES is a key predictor of customer retention and a customer's increase in spending.

Customers are busy. They expect and want their interactions with your service to be easy, fast, and valuable. Use the customer effort score to ensure you’re meeting their expectations and to identify new opportunities that will improve their experience.

<a name="in-product-feedback-what-s-in-the-survey"></a>
## What&#39;s in the survey

The survey consists of two questions that are always prefixed with:

1. How difficult or easy was it...
1. How valuable was...

English strings are validated to ensure questions are formatted correctly.  Each question is then followed by a rating scale which the user must complete before submitting the feedback.  Users may also choose to provide additional comments.

<a name="in-product-feedback-what-s-in-the-survey-example"></a>
### Example

![alt-text](../media/portalfx-inproduct-feedback/InProductFeedback.png "In product feedback")

<a name="in-product-feedback-when-to-ask-for-feedback"></a>
## When to ask for feedback

A good design prompts for feedback immediately after the user has completed a specific task.  Prompts that are always on and within the context of multiple tasks can lead to an accurate response.

<a name="in-product-feedback-how-to-ask-for-feedback"></a>
## How to ask for feedback

Use a Status Bar, Command Bar, or a Notification that prompts for feedback.  A good practice is to keep the text neutral, for example: "Send us your feedback"

<a name="in-product-feedback-how-to-use-the-inproductfeedbackblade-ipf"></a>
## How to use the InProductFeedbackBlade (IPF)

The IPF blade is designed and optimized for use within a context pane.  The blade requires 6 parameters that will also be used for reporting:

- featureName
- surveyId
- bladeName
- extensionName
- cesQuestion
- cvaQuestion

<a name="in-product-feedback-how-to-use-the-inproductfeedbackblade-ipf-implementation-example"></a>
### Implementation Example

```typescript
const bladeName = "Your_Blade";
const extensionName = "Your_Extension";

container.openContextPane(BladeReferences.forBlade("InProductFeedbackBlade").createReference({
    parameters: {
        bladeName,
        cesQuestion: inProductFeedbackClientStrings.cesQuestion,
        cvaQuestion: inProductFeedbackClientStrings.cvaQuestion,
        extensionName,
        featureName: "Your_FeatureName",
        surveyId: "FeatureName+Date",
    },
    onClosed: (reason: BladeClosedReason) => {
        if (reason === BladeClosedReason.ChildClosedSelf) {
            container.statusBar(null);
        }
    },
}));
```

<a name="in-product-feedback-how-to-review-the-results"></a>
## How to review the results

Feedback results are available via the [IPF Dashboard](https://aka.ms/portalfx/dashboard/CESCVA).

Survey results are also available in Kusto using the following query.

[Link to query](https://dataexplorer.azure.com/clusters/azportalpartner/databases/AzurePortal?query=H4sIAAAAAAAAA22SwWrDMAyG73sK00tSMIU9QAZdaWkvo5DSuxJrnbfYDrbcLWUPvyTMdrb0qP//hH9JrhvvCG2ewa01lqBpwZJGmy1XAggqcJhn65u3eBztXt80EjWdsEGFZLuHb/b5hhbZ0WItHZ6kwpJAteypYHAx+aNYRsY7tKeuxb3UxIqCLRbRcsbbGgcxO+ijNcLXtEMUFdQfzw0IzCIKNUmj76Olr5SkxOIXoXYB3/vKbYMyQKMt2DArKxgZ0WlQss4HYZn8VwTqdxBbX0D1Uce2FU7FWcsYfYpXQUjoZlueofERCfWEOK//Er91ImqjVH8WF4hQzwJNs0ykxDlvr9gdRIBCnYgrNFKUZKW+7IxVQAGdGalHQbcxmvrTBTgpPdVa84699/8T8WlsHrPxuxfhs6XzuFsed8jjrvh8Ej5+0eGBFO8HA0nncyQDAAA=)

```js
cluster('azportalpartner').database('AzurePortal').ClientTelemetry
| where PreciseTimeStamp >= ago(1d)
| where userTypeHint == ""
| where source == 'InProductFeedbackBlade'
| where action == 'InProductFeedbackSubmit'
| where extension == 'HubsExtension'
| extend data = todynamic(data)
| extend featureExtensionName = data.extensionName
| extend featureBladeName = data.bladeName
| extend CESValue = data.CESValue
| extend CVAValue = data.CVAValue
| extend comments = data.comments
| extend featureName = data.featureName
| extend surveyId = data.surveyId
| extend validStringFormat = data.validStringFormat
| extend mayContact = data.mayContact
| project PreciseTimeStamp, featureName, surveyId, featureExtensionName, featureBladeName, CESValue, CVAValue, comments, validStringFormat, userId, mayContact
```
