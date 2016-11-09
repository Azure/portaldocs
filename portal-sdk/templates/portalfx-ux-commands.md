<properties title="Commands" pageTitle="Commands" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="07/16/2015" 
    ms.author="mattshel"/>    

## Commands ##

Commands encapsulate an action and subsequent behavior. Commands can be shell commands (built-in), or custom  commands that you create. 

We have a well-defined experience for commands that is consistent across the portal. These core commands come built-in and can’t be redefined by extension developers. You can contribute new commands, but the way those commands are exposed to the user can't be changed.
  
![The command bar in a web app][Commands]


## Handling overflow ##

Each blade size (.5, 1, 1.5) has a maximum number of commands it can show in a single line. Anything above this max is shown in the overflow area. To open or collapse overflow, the user clicks "**...**":


If you have commands you want users to see right away, make sure they aren't in the overflow are (where they could be missed).

## What can commands do? ##

Commands can:

- Execute actions (for example, **Restart** or **Delete**). These sorts of actions can: 


	- Ask for a confirmation (for example, when the user wants to stop a web app)
	![The command bar in a web app][Command_confirm]
	- Show a progress bar with the time left until the action completes
	- Open an external link (e.g., Browse Web app)
	- Open a child blade (e.g., DocumentExplorer in DocumentDB or Settings)
	- Open the context panel (e.g., Filter in the Gallery)

## The Delete command ##

The Delete command is special, since it can work in one of three ways:

1. The item is deleted, with no further user interaction.
2. The user gets a confirmation message (*Are you sure you want to delete FreezingFog? Y/N*)
3. The user has to type the name of the resource in order to delete it. This option is the "safest," since it requires the most user action.
 









[Commands]: ../media/portalfx-ux-commands/Commands.jpg
[Command_confirm]: ../media/portalfx-ux-commands/Command_confirm.jpg
