
<a name="essentials"></a>
### Essentials

Essentials are a high-level snapshot of a resource. The Essentials pane contains the most important resource properties, along with links to other locations in the portal. The content in the Essentials pane is divided into two columns: the left column shows 5 properties similar to the Browse view, while the right column shows 5 properties specific to the resource. Extensions decide what properties to show in the right column, and whether they're static or dynamic.

![essentials part image][essentials]


Properties **can** contain links, and can open blades containing related resources (for example, resource group, subscription, hosting plan, etc). The links can also point to external sites. Properties **can't** open blades that collect information.

Everything that appears in the Essentials pane should also be accessible in <strong>Settings</strong>.

<a name="essentials-ordering-guidelines"></a>
#### Ordering guidelines

**Left column**

1. Resource group
1. Status
1. Location
1. Subscription name (as a link to a child blade)
1. Subscription ID

**Right column**

Up to 5 key domain-specific properties in the following order (<span style="color:#ff0000;font-size:large;">*</span><span style="color:#ff0000;"> = required</span>):</p>
 
* URL [link to site in a new tab] <span style="color:#ff0000;font-size:large;"><strong>*</strong></span>
* Web hosting plan [link to hosting plan blade] <span style="color:#ff0000;font-size:large;"><strong>*</strong></span>
 
Choose from the following options to complete the list:



- If no continuous deployment, no linked database, no IP SSL then add:

	- FTP/Deployment username [text]
	- FTP hostname [text]
	- FTPS hostname [text]

- If no continuous deployment but with 1+ linked database(s), then add:

	- Linked database [link to blade]
	- FTP/Deployment username [text]
	- FTP hostname [text]

- If no continuous deployment but with 1+ IP SSL binding(s), then add:

	- Virtual IP address
	- FTP/Deployment username [text]
	- FTP hostname [text]

- If using a local Git continuous deployment, then add:

	- 	Git/Deployment username [text]
	- 	Git clone URL [text]
	- 	FTP hostname [text]

- If using team project continuous deployment, then add:

	- Team project [link to team project blade]
	- FTP/Deployment username [text]
	- FTP hostname

- If using 3rd party continuous deployment, then add:

	- Git clone URL (or Hg equivalent) [text]
	- Git/Deployment username [text]
	- Project URL (or the folder if using Dropbox) [link to project in a new tab]


[essentials]: ../media/portalfx-ux-essentials/Essentials.PNG
