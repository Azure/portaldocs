```json
{
        "displayName": "East US",
        /**
         * The normalized name of the location.
         */
        "name": "eastus",
        /**
         * The fully qualified ID of the location.
         */
        "id": "/subscriptions/{subscription-ID}/locations/eastus",
        /**
         * The display name with the Region included
         */
        "regionalDisplayName": "(US) East US",
        /**
         * The type of the location, can be "Region" or "EdgeZone".
         */
        "type": "Region",
        /**
         * Metadata about the location
         * 'type' will determine which interface is returned from ARM
         * If 'type' is "Region", then 'metadata can be casted to type 'RegionLocationMetadata'.
         * If 'type' is "EdgeZone", then 'metadata can be casted to type 'EdgeZoneLocationMetadata'.
         */
        "metadata": {
                "geographyGroup": "US",
                "latitude": "37.3719",
                "longitude": "-79.8164",
                "pairedRegion": [
                        {
                                "name": "westus", 
                                "id": "/subscriptions/{subscription-ID}/locations/westus"
                        }
                ],
                "physicalLocation": "Virginia",
                "regionCategory": "Recommended",
                "regionType": "Physical"
        }
}     
```