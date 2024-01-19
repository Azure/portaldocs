<a name="view-dashboardviewtype-arcsnapshottiledata"></a>
# view-dashboardViewType-arcSnapshotTileData
* [view-dashboardViewType-arcSnapshotTileData](#view-dashboardviewtype-arcsnapshottiledata)
    * [Definitions:](#view-dashboardviewtype-arcsnapshottiledata-definitions)

<a name="view-dashboardviewtype-arcsnapshottiledata-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-arcsnapshottiledata-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|The ARG data source of the query tile. Enum permitting the value: "arg"
|query|True|The valid ARG query used to fetch the data.
|columns|True|The column names to get from the query result. See [here](dx-view-dashboardviewType-arcSnapshotTileDataColumns.md) for more information.
|allResourcesConfiguredText|False|The text to be shown when all the resources are configured with the service.
|usedParameters|False|Parameter names that are applied to the tile. It can be used within the query.
|noResources|False|Used when the resource count returned from the count is zero. See [here](dx-view-dashboardViewType-arcSnapshotTileDataNoResources.md) for more information.
|actions|False|Actions that can be taken on the arc snapshot tile. See [here](dx-view-dashboardViewType-arcSnapshotTileDataActions.md) for more information.
|fx.feature|False|
