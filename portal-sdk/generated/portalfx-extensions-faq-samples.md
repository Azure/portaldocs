
<a name="frequently-asked-questions"></a>
## Frequently asked questions


<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->
<a name="frequently-asked-questions-samples-will-not-compile"></a>
### Samples will not compile

***How do I fix this?***

 DESCRIPTION:  

  By default, the samples are not aware of whether V1 or V2 is being used, or whether the IDE options match the version. There may be an error message TS1219.  Errors may also occur based on the version of the SDK.

 SOLUTION: 

 Add a `tsconfig.json` file to the project that specifies that decorators are experimental, as in the following code.

 ```cs
 {
  "compilerOptions": {
    "noImplicitAny": false,
    "noEmitOnError": true,
    "removeComments": false,
    "sourceMap": true,
    "target": "es5",
    "experimentalDecorators": true
  },
  "exclude": [
    "node_modules"
  ]
}
 ```
 
 For more information, see [https://stackoverflow.com/questions/35460232/using-of-typescript-decorators-caused-errors](https://stackoverflow.com/questions/35460232/using-of-typescript-decorators-caused-errors).

 * * *

<a name="frequently-asked-questions-cannot-launch-iis"></a>
### Cannot launch IIS

*** Unable to launch the Microsoft Visual Studio IIS Express Web server***

DESCRIPTION:

Failed to register URL "https://localhost:44306/" for site "SamplesExtension" application "/". Error description: Cannot create a file when that file already exists. (0x800700b7)

SOLUTION: 

Terminate IIS express processes in Task Manager and press F5 again.

* * *