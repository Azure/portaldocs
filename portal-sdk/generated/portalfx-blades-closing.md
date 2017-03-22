
<a name="closing-blades-programatically"></a>
# Closing blades programatically

This snippet shows how to close the current blade.  This can be called from either a blade or part container.  You can optionally return untyped data to the parent blade when you close your own blade.

Check out the [blade opening sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/openbladeapi) and you'll notice that the 'Close' button on the child blades that open is implemented using the new blade closing APIs.
 
The following metnods are now available on your template blade container.

```typescript

import { Container as BladeContainer } from "Fx/Composition/Blade";
   
// closes the current blade now, optionally passing data back to the parent
closeCurrentBlade(data?: any): Promise<boolean>; 
// closes the current child blade now, if one is present
closeChildBlade(): Promise<boolean>; 
// closes the current child context blade now, if one is present
closeContextBlade(): Promise<boolean>; 
```

The following methods are now available on your part container contract.

```typescript
// closes the current child blade now, if one is present
closeChildBlade(): Promise<boolean>; 
// closes the current child context blade now, if one is present
closeContextBlade(): Promise<boolean>; 
```

Each of these methods returns a promise that generally returns true.  If there is a blade on the screen that has unsaved edits to a form, the framework will prompt the user, giving them the option to keep the unsaved blade open.  If the user chooses to continue working on their unsaved edits then the blade closing promise will return false.

<a name="closing-blades-programatically-writing-code-that-reacts-to-a-blade-being-closed"></a>
## Writing code that reacts to a blade being closed

When opening a child blade, you can register the optional onClosed callback to be notified when the blade you've opened closes.  The child blade can send you untyped data that you can use in your callback.  Here is an example:
 
```typescript
import { BladeClosedReason } from "Fx/Composition";
...
container.openBlade(new SomeBladeReference({ … }, (reason: BladeClosedReason, data?: any) => {
        // Code that runs when the blade closes - Data will only be there if the child blade returned it
        // reason lets you differentiate between things like the user closing the blade via the close button vs. a parent blade programatically closing it
});
```

