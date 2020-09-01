<a name="how-to-get-well-formed-printout-from-your-content"></a>
# How to get well-formed printout from your content

<a name="how-to-get-well-formed-printout-from-your-content-understanding-the-browser-print-flow"></a>
## Understanding the browser print flow

Printing combines two radical operations on your content, reflow and fragment. The content must be reflowed to a media size that matches the paper format, and a fragmentation operation is done to create individual page content.

The reflow operation performs a relayout of the content to constrain it to a paged media format. The available space on the page to render your content is a combined factor of the size of the page, the reserved margins, the page orientation, and the scaling applied to your content.

The fragmentation operation adds page breaks to the content. This can occur anywhere on the content. To reduce unwanted fragmentation (ex.: cutting an image in half), the browser has some default heuristics, and additional hints can be added to improve the fragmentation. Despite those default heuristics and provided hints, the browser print algorithm can overrule them.

Of note, the browser will only print what is considered part of the document flow. Overflowing elements below the HTML root will not be printed, unless they are rendered as part of the content flow at time of printing.

Last but not least, browsers have their own quirks on how to perform the print rendering, and those have to be addressed to ensure a maximum range of browser compatibility.

<a name="how-to-get-well-formed-printout-from-your-content-order-of-operations-when-the-browser-print-command-runs"></a>
## Order of operations when the browser “print” command runs

- Raise the `beforeprint` event.
- Apply the media query `print` CSS rules.
- Relayout the page on a paged media format.
- Apply fragmentation rules to divide the content in pages.
- Raise the `afterprint` event once the dialog is closed.
  - This is called whether print was completed or cancelled.

<a name="how-to-get-well-formed-printout-from-your-content-javascript-limitations-of-the-print-operation"></a>
## JavaScript limitations of the print operation

While the browser will perform a relayout of the content to fit it to the paged media format, it will not trigger any JavaScript event when it does so.

If content relies on the `resize` window event, or any form of JavaScript callbacks to be relayout, it won't get that opportunity when a print command is in progress. Instead, that content will be frozen in its last rendered pixel size.

The JavaScript callback dependencies are unsurmountable with any form of quirks other than ensuring the content will relayout without needing them. While the print operation will raise the `beforeprint` event before showing the print dialog, the event won’t be called again once the print dialog is shown. In that dialog, the user can change the output format in many ways that could require the content to relayout again.

The problem is lessened for elements that are able to relayout on the page, for example, elements that are not the full width of the view port.

<a name="how-to-get-well-formed-printout-from-your-content-what-portal-does-to-help-a-well-formed-printout"></a>
## What portal does to help a well-formed printout

- Apply rules to hide undesirable content from the print.
  - This includes topbar/sidebar/context panes/dialogs and other elements that aren't the primary content.
- Add rules for page fragmentation to minimize incoherent content fragments.
  - `H*`, `az-text-header1`, `az-text-header2`, `az-text-label` are hinted to stay along with the content.
  - `P` are hinted to keep 3 lines of text together between fragments.
  - `PRE`, `BLOCKQUOTE`, `TR`, `IMG`, `SVG`, along with element with roles `row`, `img`, `figure`, are hinted to not fragment.
- Request default margins of 0.4in at the top and bottom, and 0.2in on the left and right.
- Force preservation of color information to all content.
- Apply CSS rules to ensure the content is reflowable from the document root.
- Ensure all overflow rules below the document root are removed from all child content owned by the portal UX.
- Apply additional CSS to maximize compatibility to browser quirks.
- If invoking from blade print button, ensure this blade stands alone in the print
- If invoking from the browser command (ex: keyboard shortcut), and if in blade view, ensure the last blade stands alone in the print

<a name="how-to-get-well-formed-printout-from-your-content-what-content-owner-can-do-to-ensure-a-well-formed-printout"></a>
## What content owner can do to ensure a well-formed printout

- Annotate items to be removed from the printout with the class `az-noprint`.
- Apply responsive design principles to the content to ensure compatibility with a wide range of paged media format.
- Avoid sizing content width with fixed values, especially if the value is larger than 500px after reflowing the layout.
  - Content that has fixed size in the “width” direction risk of getting cut off if it doesn’t fit the paged media format.
- Use semantics, as it helps fragmentation decision. While not guaranteed, the fragmentation engine will try to respect the rules when possible.
- Content that resize with JavaScript callbacks should be kept to minimum.

<a name="how-to-get-well-formed-printout-from-your-content-faq"></a>
## FAQ

**Q. How much space is available width wise on paper?**

**A. It is highly dependent on the paged media format and its settings.**

As an example, let's assume this paged media format and settings:

- US Letter paper format
- Portrait orientation
- Margins of 0.5in on left and right
- Content at 100% scaling
- Browser printout engine generates output at 72DPI

 This example translates to about 720px of screen pixels on the output.

**Q. What telemetry is offered about print?**

**A. The framework offers the following telemetry for tracking the print functionality usage.**

Use any of these queries in Kusto Explorer.

*Which view is print requested from?*

```kql
ClientTelemetry
| where PreciseTimeStamp >= ago(1d)
| where userTypeHint == ""
| where action == "PrintRequest"
| summarize count() by name
```

*Which method was used to invoke print?*

```kql
ClientTelemetry
| where PreciseTimeStamp >= ago(1d)
| where userTypeHint == ""
| where action == "PrintRequest"
| summarize count() by source
```

*Which display mode is shown when print was invoked?*

```kql
ClientTelemetry
| where PreciseTimeStamp >= ago(1d)
| where userTypeHint == ""
| where action == "PrintRequest"
| extend displayMode = tostring(parse_json(data)["displayMode"])
| summarize count() by displayMode
```

*Did the user complete or cancelled the print operation?*

We cannot know is if the user is completing or cancelling the print operation. We can only know the dialog was shown and eventually closed.
