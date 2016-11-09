<properties title="" pageTitle="Binding Quick Reference" description="" authors="nickharris,tomacox" />

## PDL Binding Quick Reference

<table>
<thead>
<tr>  
  <th>Binding</th>
  <th>Applies To</th>
  <th>Notes</th>
</tr>
</thead>
<tbody>
<tr>  
  <td>ViewModel="BladeViewModel"</td>
  <td rowspan="2">Blade, CustomPart</td>
  <td>Binds to filename BladeViewModel.ts and class name BladeViewModel. </td>    
</tr>
<tr>
<td>ViewModel="{ViewModel Name=BladeViewModel, Module=./Locked/ViewModels/BladeViewModelFilename}"</td>  
  <td>Binds to BladeViewModel defined within BladeViewModelFilename.ts located at path ./Locked/ViewModels/ </td>
</tr>
<tr>
  <td>
<pre>
&lt;Blade.Parameters&gt;
   &lt;Parameter Name="id" Type="%Type%" /&gt;
&lt;/Blade.Parameters&gt;
</pre>
  <td>Blade.Parameters</td>
  <td>Blade.Parameters is used to define a collection of Parameter elements that define the parameters the blade is required to receive from the caller. %Type% may be any of the following values {Key, NewEditScope, Output, Supplemental} <a href="/documentation/articles/portalfx-blades-parameters"> - more detail</a></td>
</tr>
<tr>
  <td>
  <pre>
&lt;Blade.Properties&gt;
  &lt;Property Name="idX" 
               Source="{BladeParameter id}"/&gt;
&lt;/Blade.Properties&gt;
  </pre>
  <td>Blade.Properties</td>
  <td>Blade parameters defined within Blade.Parameters can be passed to the blade view model via a Blade.Property collection of Property elements bound to a Source BladeParameter.  In this example the blade ViewModel onInputsSet method inputs parameter will have a property inputs.idX that contains the value of the supplied BladeParameter with name id <a href="/documentation/articles/portalfx-blades-properties">- more detail</a></td>
</tr>

<tr>
  <td>Template="{Html Source='..\\..\\Common\\Templates\\PartWithTitle.html'}"</td>
  <td>CustomPart</td>
  <td>Defines a html template for CustomPart located at relative path .\\..\\Common\\Templates\\PartWithTitle.html</td>
</tr>

<tr>
  <td>Template="{Html Source='..\\..\\Common\\Templates\\PartWithTitle.html'}"</td>
  <td>CustomPart</td>
  <td>Defines a html template for CustomPart located at relative path .\\..\\Common\\Templates\\PartWithTitle.html</td>
</tr>
<tr>
 <td>
 <pre>
&lt;Lens ...&gt;
  &lt;CustomPart ...&gt;
    &lt;CustomPart.Properties&gt;
       &lt;Property Name="resetTriggered" 
 	Source="{ActionBarProperty resetTriggered}" /&gt;
    &lt;/CustomPart.Properties&gt;
  &lt;/CustomPart&gt;
&lt;/Lens&gt;
&lt;ActionBar Name="FilterFormActionBar"
       ActionBarKind="Generic"
       ViewModel="FilterFormActionBarViewModel"&gt;
&lt;/ActionBar&gt;
  </pre>
  </td> 
  <td>CustomPart.Properties</td>
  <td>As FilterFormActionBarViewModel.resetTriggered changes onInputsSet will be called on the CustomPart ViewModel with parameter inputs.resetTriggered defined with the value of FilterFormActionBarViewModel.resetTriggered</td>
 </tr>
</tbody>
</table>
