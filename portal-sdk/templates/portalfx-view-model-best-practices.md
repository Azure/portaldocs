<properties title="" pageTitle="View Model Best Practices" description="" authors="LiangMingChen" />

## View Model Best Practices

This document is a WIP.

###  2:15:01 PM MsPortalFx.Base.Diagnostics.ErrorReporter 1 TypeError: Can't add property <name>, object is not extensible

 _adapter and _restManager properties are set to null as shown below. This allows the properties to be defined on the object and not be dynamically added before the framework calls freeze on the javascript object.

```ts
export class AzureMediaServices implements Sdk.AzureMediaServices {
..
private _adapter: BreezeAdapter = null;
private _restManager: breeze.EntityManager = null;
..
}

```

### Work with Knockout (Data driven model) and Iframe communication in mind

1. Less Change Notification is always better.
    1. You don't know who is listening to your ko.obserable.  The more change-notification, the more code will get executed!!
        - If you have 10 change to do, you should try to batch them and change-notify once. (Especially for Array. -- See Array Mutation Performance warning - below)
    1. Weary about the properties that bind to UI elements.
        - Cost!!  Proxied need to send all the data over, Dom update delete the element and re-render!!!
        - If your react to noisy-change-notification, you are update the UI multiple times.
            - Identify which dependency is noisy.
            - Fix the root cause -Find out why your dependencies are  noisy-change-notification.
                - Array Mutation Performance warning: (below).
            - If you can't fix the root cause Possible solution:
                - Work hard to keep the items --- Reuse them as much as possible (Knockout map, filter etc.)
                    } You might get lucky that no item actually changed, thus the UI will not react to it.
                    } That's said, that still cause change-notification over the iFrame (even though data is not changed. :()
                - Keep them is not possible, you should looking into knockout rate limited.  https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=Knockoutjs+ratelimit
1. Reactor, computed and pureComputed
    1. Explicitly know what  dependencies the code will subscribe to.
        - Avoid call to utility function which direct access any ko.observable.
        - Alternatively, utility function should use .peek() to avoid accidentally take on the dependency.
        - Some change to use subscribe over the computed for the reason that the precise one depedency.
            - Be ware that subscribe doesn't call the first time.  Computed is called the first time.  pureComputed only get computed when someone subscribe to it.
    1. Small is better, Knock out will cache value for you.
        - Break down the big compute to smaller computes which will isolate the code dependency and Knockout will cache compute value for unchanged portion of the dependencies for you.  Thus reduce the computation cost.
    1. For array, leverage  Knock out projection map and filter.
        - More items stay, less communication is required to transmit to the other iframe.
            - By default, knockout/proxiedobserable will only send the difference between the array contents.
        - Leverage the childLifetime in the call back function --- your call back will know when "delete" happen, not just the "add"
            - You will be notify when the "delete" happen by adding the following

```ts
    childLifetime.registerForDispose({
    dispose: () => { console.log("this item is deleted");}
});

```
    1. By default, make your property prefix with "_" which prevent it from ship over to the other Iframe
        - Every property is ship over, Proxied layer will subscribe to the item, queue the change etc.
        - Method will be ship over as well.
        - Avoid to use getter and setter as mean to not to proxied over the iframe.
            -This means that proxied layer have to ask every properties whether the property is getter or setter, which is costly. We are trying hard to optimized the performance with it.

### Performance warning: A proxied observable array is mutated inefficiently. -- What is is and how to fix it.
 1. What does this means?
    - As our above discussion on performance in the code.  One area that we identify is array mutation function can be very noisy.  The impact to the proxied communication between iframe and the domino effect on the code get executes on the both side are quite significant. The transportation layer doesn't have contextal knowledge on what either side need to perform. It will accumlate all changes and notification and reply in the other side.
    - Cost and Imapcts: Reduce from 10 notifications to 1 notification will mean 9 repeated code paths are eliminated.
 1. How to Decipher the error message In the below sample message:
    - id ( this will show what object it is.  In this example, is a object that's send from Extension "Microsoft_Azure_Insights" to "Fx" the object property is been perform on is Obj.children[2].innerViewModel.items[0].parentData.profiles
    - It is an observable array which is already been proxied.
    - Pattern:4N4N4N4N:  The array mutation pattern is 4N4N4N4N.
      - The number mean the operation corresponding to legend in the next sentence: Legend:pop:0;push:1;reverse:2;shift:3;splice:4;unshift:5;reset:6
      - "N" stand for Array Change Notification is fired.
      - 4N4N4N4N means that splice-Notify-splice-Notify-splice-Notify-splice-Notify is been performed on this Array.  4 Notification(s) will be fired from one frame to the other.
    - Notice that we currently only fire this warning when 4+ Change-Notification in the tight loop to trigger this performance warning.
      - if there is only 2 or 3, yes, there are still room to improve, but still those are not the biggest chunk to avoid.
    - Now you have been notified. You have works cut out for you: Thus the next:
      - Consider to rework by accumulating all changes in a new array and set to proxied observable array once to avoid unnecessary change notification.
    - Attach the call stack for you to inspect.
      - You typically want to get as bottom in the stack as possible.
        - The higher the stack, it is likely to be the tailing of the domino effect.
        - The callstack will typically reflect the pattern 4N4N4N4N, is the splice- notification.  Thus the call stack on top will have a splice method
           - Function.ko.utils.arrayForEach.ko.observableArray.fn.(anonymous function) [as splice]
    - Since you are on 4+ pattern. You likely want to look at what happens in prior call stack to get to this repeated 4+ time pattern:
      - To identify the source of performce issue, use ?trace=poarraymutation to log all proxied observable array muntations
      - ?trace=poarraymutation is very powerful but ...
        - It is vary noisy. It will report all array mutation in the console log as warning. Such it is recommanded to narrow it down to right before this performance warning happens then open the F12.
        - You want to pay special attention to Id that match your point of insterest.  In this case. id === Microsoft_Azure_Insights-fx-0_1-1406-children.2.innerViewModel.items.0.parentData.profiles.
    - In the following example we try down the issue in MergeEntityOnlyVisitor.MergeVisitor._mergeArray
      - Note that, it is a Framework bug in this case.
      - We analysis the result and come up with a fix to bring the Change-Notification down to less than 4.
    - What if there is a trade off for this performance drawback at this place verse the other.
      - Well, in the perfect world, we love for you to fix this if possible.  Consider that if this observable is been proxied. The likelyhood that this is somehow tie to UI is very high.  Anyway to reduce the change-notification will be better in performance.
      - But, there are aways trade-off to make.  In some case, if your team can justify the balance of the performance goal, say, you would like to optimize for initial load-showup trade off later cached-record to be multiple-time slower. There is a way to opt out at cost of more coding and comments to justify it.
        - There is way to do this. Performance is no difference than try to manage water crisis for water drought. If you have to do extra work or money to get more resource, then likelyhood of people violate the conservation is less.
  1. Avoid to use ko.obsersvableArray build-in method if this observableArray is already proxied.  Most if not all method (push,push, reverse,shift,splice,unshift, remove) is noisy notification. Notify per operation.
    - Try to have utility function take a array instead of 1 arguments.
      - For example, we have to deprecate the MsPortalFx.ViewModels.Parts.Properties.ViewModel.AddProperty and in favor of MsPortalFx.ViewModels.Parts.Properties.ViewModel.SetProperties
    - It is case by case secnario. You have more context on what you are doing and how to better avoid the repeated code paths to be triggered.

```
    [Microsoft_Azure_Insights]  11:38:55 AM MsPortalFx/Base/Base.ProxiedObservables 1 Performance warning: A proxied observable array with id(Microsoft_Azure_Insights-fx-0_1-1406-children.2.innerViewModel.items.0.parentData.profiles), is mutated inefficiently. Pattern:4N4N4N4N. Legend:pop:0;push:1;reverse:2;shift:3;splice:4;unshift:5.
Consider reworking to accumulate all changes in a new array and set to proxied observable array once to avoid unnecessary change notification.
To identify the source of performce issue, use ?trace=poarraymutation to log all proxied observable array muntations.
The error occured in:
    at Array.arrayMutationFuncNames.forEach.prototype.(anonymous function) (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Base/Base.ProxiedObservables.js:874:80)
    at Function.ko.utils.arrayForEach.ko.observableArray.fn.(anonymous function) [as splice] (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/_oss/knockout-3.2.0.debug.js:1392:60)
    at https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:194:57
    at Array.forEach (native)
    at MergeEntityOnlyVisitor.MergeVisitor._mergeArray (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:191:127)
    at MergeEntityOnlyVisitor.MergeVisitor.visitArray (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:134:37)
    at MergeEntityOnlyVisitor.Visitor.visitNonEntityArray (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:56:44)
    at MergeEntityOnlyVisitor.Visitor._visitArrayDispatch (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:206:48)
    at MergeEntityOnlyVisitor.MergeVisitor.visitObjectPropertyValue (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:90:43)
    at MergeEntityOnlyVisitor.MergeVisitor.visitNonEntityTypedObjectPropertyValue (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:79:44)
    at MergeEntityOnlyVisitor.Visitor.visitObjectPropertyValueDispatch (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:180:48)
    at MergeEntityOnlyVisitor.MergeVisitor.visitObjectPropertyValueDispatch (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:60:84)
    at https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:50:38
    at Array.every (native)
    at MergeEntityOnlyVisitor.MergeVisitor.visitObject (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:49:88)
    at MergeEntityOnlyVisitor.Visitor.visitEntity (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:81:44)
    at MergeEntityOnlyVisitor.Visitor._visitObjectDispatch (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:212:48)
    at MergeEntityOnlyVisitor.Visitor._visit (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:188:37)
    at MergeEntityOnlyVisitor.MergeVisitor.merge (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.MergeVisitor.js:36:58)
    at MergeEntityOnlyVisitor.mergeEntity (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:1776:44)
    at InputIsOriginalEditScope.EditScopeBase._revertEntity (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:832:58)
    at InputIsOriginalEditScope.EditScopeBase.revert (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:414:26)
    at Object.EditScopeBase._createRevertAllVisitor.EditableVisitor._createVisitorCallbacks.visitEntity (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:920:35)
    at EditableVisitor.Visitor._visitObjectDispatch (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:212:48)
    at EditableVisitor.Visitor._visit (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:188:37)
    at EditableVisitor.Visitor.visit (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Internal/Internal.Data.Visitor.js:44:33)
    at InputIsOriginalEditScope.EditScopeBase._revertAll (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:898:44)
    at InputIsOriginalEditScope.EditScopeBase.revertAll (https://shell-s2-portal.azurecomcdn.net/Content/5.0.302.9531526.150908-1021/Scripts/MsPortalFx/Data/Data.EditScope.js:422:26)
    at DiscardScaleSettingCommand.execute (https://onestb.cloudapp.net:8443/insights/Content/Scripts/InsightsExtension/Client/Scales/Commands/DiscardScaleSettingCommand.js:30:50)
```

### Performance warning: This computed has high depenenciesCount. -- What it is and how to fix it.
 1. What is it?
       It means that a computed or reactor has a lot of dependencies (30 as of March 2016).
       When a computed/reactor have high dependencies count, that means the potential that this computed will get executed a lot of times when any of the depenency changes.
       Any subscribers to this computed  or reactor update some obserable will get trigger change notification.  It starts a huge dominos effect.  It is potential drag down the performance of the portal.
       Any computed will re-accumulate all the dependency.  With this amount of dependency, you are looking at array of depdencies's subsbscribers will be update.  Reset all prior dependencies's subscriptions list.etc
       It is expensive not to mention execute a lot of times.
 1. How can I fix it.
      1. Check if the computed/reactor accidentally picks up these other dependencies.  Inspect your helper functions.
          1. Instead of observable(). Change to use observable.peek() as it will not pick up this dependency
              1. Note that ko.util.unwrap(observable) will pick up the dependency.
          1. If it calls a helper function, you might want to wrap it with ko.ignoreDependencies(helperfunction()) such that dependencies in the helperFunction access doesn't count as your dependency.
          1. If you use ko projection map or filter. Note that it will not only pick up dependency on "arrayChanges", anything that map/filter call back will pick up as dependency. Consider to use koObservableArray.mapInto intstead, which will only subscribe to "arrayChange" event and not any dependencies that might caused by map function
      1. Consider to break down your computed/reactor to smaller computed
          1. child computed have several benfits.
              1. it cache the previous result.  For example, you need to do the same caculation for 10 rows of grid data.  If you breaks down this computed to per-row subcomputed. When Row10 is updated, only Row10 will re-caculated. Previous 9 row merely pick up the "cached" value.
              2. You can in additon leverage the childLifetimeManager just like projection map does.

 1. Sample:
      1. Note that changeCount means this computed is executed/updated 916 times.
      1. callback is the function body for the computed/reactor  that you provided. Mostly are anonymous (lambda expression.) Function name is typically "".  Thus we provide the function.toString() for you to track down it.
      1. dependenciesCount for the current computed dependencies

 ```
Base.Diagnostics.js:384 [fx]  6:05:59 PM MsPortalFx/Base/Base.KnockoutExtensions Base.KnockoutExtensions: Performance Error: This computed has depenenciesCount: 36 is higher than expected limit: 30
Consider to breakdown the computed to smaller piece. For detail suggestion:  http://aka.ms/portalfx/vmbp
changeCount:916
callback:function () {
                    _this._checkForChartUpdate();
                    return _this._chartDataImmediateUpdatedCounter = (_this._chartDataImmediateUpdatedCounter + 1) & 0xfff;
                }
```

     1. Open a bug and optout as temporary measure. Note that the first and last lines below should be specified exactly as below.

```
            executeInDevelopmentModeOnly(() => {
                // RDBug 6005470:[Performance]: CsmTopology.ts have a computed take on High count of computed dependency
                const markIgnoreHighDependenciesCount = MsPortalFx.Base.KnockoutExtensions.markIgnoreHighDependenciesCount;
                markIgnoreHighDependenciesCount && markIgnoreHighDependenciesCount(this._nodes);
            }); // executeInDevelopmentModeOnly
```

  1. Another Sample:
      1. RDBug 6033418 [Perf] Selection.ts computed accidently pick up a lot of computed dependencies due to use of the pass-in function for compare
      1. The reason, the constructor take a custom item comparer function.  The problem is that the caller provide the comparer function doesn't know it will be used inside a compute. As result, in Grid, after 2 "load more", this compute dependency grows from 11 to 242 dependencies.
      1. The fix : wrap the unsafe custom item comparer function within ko.ignoreDependency

```
             // itemMatchesSelection is given function, require to wrapped around ko.ignoreDependencies to avoid pick up unwantted dependency
            const ignoreKOItemMatchesSelection: typeof itemMatchesSelection = function (item: T, selection: U): boolean {
                return ko.ignoreDependencies(() => itemMatchesSelection(item, selection));
            };
```
