
## Data atomization

Atomization fulfills two main goals: 

1. Enables several data views to be bound to one data entity, thus giving smooth, consistent experience to user, where two views representing the same asset are always in sync. 
1. Minimizes memory trace.

Atomization can be switched only for entities, which have globally unique IDs (per type) in our metadata system. In case of such entity, add a third attribute to its TypeMetadataModel attribute in C#:

```cs

[TypeMetadataModel(typeof(Robot), "SamplesExtension.DataModels", true /* Safe to unify entity as Robot IDs are globally unique. */)]

```

Attribute is not inherited and has to be set to true for all types, which should be atomized. Atomization is switched off by default. Atomization should work out of the box in the simpliest case, all entities within extension will use the same atomization context - default one.

It is possible to select a different atomization context for a given entity cache/query cache:

```cs

var cache = new MsPortalFx.Data.QueryCache<ModelType, QueryType>({
    ...
    atomizationOptions: {
        atomizationContextId: "string-id"
    }
    ...
});

```
