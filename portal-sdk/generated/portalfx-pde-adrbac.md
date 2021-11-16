* [Getting started with the Select Members Blade](#getting-started-with-the-select-members-blade)
* [What is the Select Member Blade?](#what-is-the-select-member-blade)
* [Downloading the PDE](#downloading-the-pde)
* [Example Collector](#example-collector)
* [PDL Changes](#pdl-changes)
* [Configuration Options](#configuration-options)
* [searchCriteria Values](#searchcriteria-values)
* [Pre-selecting Members](#pre-selecting-members)


<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="select-members-usage-doc"
    ms.date="10/29/2015"
    ms.author="admeyerms"/>

<a name="getting-started-with-the-select-members-blade"></a>
## Getting started with the Select Members Blade

<a name="what-is-the-select-member-blade"></a>
## What is the Select Member Blade?

The Select Member Blade is a tool intended to unify "member selection" scenarios across the portal by separating the process of selection from the action being taken on those members. This means the hosting extension will be responsible for making any changes to the back-end data after the members have been returned by the Select Member Blade. Note that currently, a "member" can refer to any User, Group, or Service Principal within the current tenant's context. The Select Member Blade is built using the ParameterCollection Framework v3.0. This means the Select Member Blade is a "provider" and that to use it, you will need to write a "collector" which calls it. An example of this can be found in the next section. To better understand the basics of how passing data with this framework works, see the examples of its usage in the Samples extension provided with the Azure SDK.

![Select Member Blade](../media/portalfx-pde-aadrbac/SMBimg.PNG)

<a name="downloading-the-pde"></a>
## Downloading the PDE

The .pde you need to reference can be found by downloading the Microsoft.Portal.Extensions.AAD.nuget from \\\wanuget\nugetpackages\dev and extracting the contents. (the .pde will be found under /Content/_extensions/AAD)

<a name="example-collector"></a>
## Example Collector

    // This interface is used to define the inputs from the collector.
    export interface SelectMemberInputs {
        memberIds: KnockoutObservable<string>;
    }

    // This interface is used to define the config from the collector.
    export interface SelectMemberConfig {
        isSingleSelect: boolean;
        isInviteEnabled: boolean;
        searchCriteria: string[];
    }

    /**
     * This is an example of a command which calls into the select member blade
     */
    export class TestSelectMemberV3CommandViewModel extends MsPortalFx.ViewModels.OpenBladeCommand implements VMD.Contract {

      // collector
      public selectMemberCollector: MsPortalFx.ViewModels.ParameterCollector<SelectMemberInputs>;

      // inputs
      private _memberIds = ko.observable("");

      // configuration values
      private _isSingleSelect = ko.observable(true);
      private _isInviteEnabled = ko.observable(true);
      private _searchCriteria = ko.observableArray<string>([]);

      // blade parameter values (these are passed via the blade params, not via the PCv3 framework.)
      public title = "Choose Members";
      public subtitle = "Select Member Blade";

      constructor(_container: MsPortalFx.ViewModels.CommandContainerContract, initialState: any, dataContext: SharedArea.DataContext) {
          super(_container);
          this.icon(MsPortalFx.Base.Images.Polychromatic.Key());

          this.selectMemberCollector = new MsPortalFx.ViewModels.ParameterCollector<SelectMemberInputs>(_container, {
              supplyInitialData: () => {
                  return <SelectMemberInputs> {
                      // this is where you would pass in an array of pre-selected members, if you desire.
                      memberIds: ko.observable("")
                  };
              },
              receiveResult: (result: SelectMemberInputs) => {
                  // this is what will happen when the user finishes selecting members and the blade closes.
                  this._performActionOnMembers(result.memberIds());
              },
              supplyProviderConfig: () => {
                  return <SelectMemberConfig> {
                      isSingleSelect: this._isSingleSelect(),
                      isInviteEnabled: this._isInviteEnabled(),
                      searchCriteria: this._searchCriteria()
                  };
              }
          });
      }

      // normally, you would perform some action on the returned members here. In this example, just dump the payload into the log.
      private _performActionOnMembers(membersAsJson: string) {
          log.verbose(membersAsJson);
      }

      public onInputsSet(inputs: VMD.InputsContract): Promise<any> {
          // these inputs are coming from another part
          this._isSingleSelect(inputs.isSingleSelect);
          this._isInviteEnabled(inputs.isInviteEnabled);

          // remove all elements of the array
          this._searchCriteria = ko.observableArray<string>(["IncludeAllUsers", "IncludeOnlySecurityGroups", "ExcludeMSAUsers"]);

          return Promise.resolve();
      }
    }

<a name="pdl-changes"></a>
## PDL Changes

The following is an example of the PDL changes needed to use the blade. Note that "title" and "subtitle" will actually set

the title and subtitle which appear on the selectMember blade.

```xml
<!--This is a test collector for the selectMemberv3 blade-->
    <Command Name ="TestSelectMemberV3Command"
             Kind ="Blade"
             Text ="{Resource testSelectMemberV3CommandTitle, Module=ClientResources}"
             ViewModel ="TestSelectMemberV3CommandViewModel">
      <BladeAction Blade ="{BladeReference SelectMemberV3, ExtensionName=Microsoft_Azure_AD}"
                   ParameterCollector ="selectMemberCollector">
        <BladeInput Parameter="title" Source="title" />
        <BladeInput Parameter="subtitle" Source="subtitle" />
      </BladeAction>
      <Property Name="isSingleSelect" Source="{PartProperty Part=SomeOtherPart, Property=isSingleSelect}"/>
      <Property Name="isInviteEnabled" Source="{PartProperty Part=SomeOtherPart, Property=isInviteEnabled}"/>
    </Command>
```

<a name="configuration-options"></a>
## Configuration Options

The Select Member Blade has several available options for configuration.
- isSingleSelect: if true, only one member may be selected at a time. if false, multiple members may be selected (no limit)
- isInviteEnabled: if true, users may invite external users to the current tenant via a command button on the blade. If false, the command button will not be enabled, preventing this behavior.
- searchCriteria: this is an array of strings which are associated with various settings for the blade. The acceptable settings are listed in the next section. Note that these settings are cumulative, and as many can be applied as wanted.

<a name="searchcriteria-values"></a>
## searchCriteria Values

- IncludeAllUsers: this query includes all users (guest and non-guest users)
- IncludeOnlySecurityGroups: this query includes security groups
- IncludeServicePrincipals: this query includes service principals
- ExcludeMSAUsers: this query excludes MSA users (they will be disabled and not selectable)

<a name="pre-selecting-members"></a>
## Pre-selecting Members

Pre-selecting members allows you to indicate which members are already in the role for which you are selecting members. For example, if you are selecting an admin, you may want to indicate which members are already admins to avoid choosing them again. This is accomplished by passing a JSON-serialized array of strings in the collector's supplyInitialData function (see the example collector above). Each string in the array should contain the GUID of the User/Group/Service Principal which should be marked as pre-selected by the Select Member Blade.
