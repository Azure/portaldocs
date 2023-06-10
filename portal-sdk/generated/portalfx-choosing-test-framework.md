* [Choosing the right test Framework](#choosing-the-right-test-framework)


<a name="choosing-the-right-test-framework"></a>
# Choosing the right test Framework

The Ibiza team supports an end-to-end TypeScript-based test framework known as AzurePortal-Test. Partners can use this framework for developing end to end tests. The test framework has an inner source a contribution model.  Partners are encouraged to submit Pull Requests for fixes and features to improve the framework. Building a strong community around the test framework will help improve the development experience for everyone.

1. Typescript Test Framework (@microsoft/azureportal-test)

We have partnered with the IaaS team to develop an open-source typescript test framework. In fact, we are building an end to end test suite for our own extensions against this test framework. As part of developing this test framework we are building certain abstractions such as ‘open blade’ and ‘Navigate to settings blade’ that can be useful for testing your extensions too. The release of the typescript test framework is already decoupled from the release of SDK so partners can pick up latest version of it without recompiling their extension against a newer version of the Ibiza SDK.

[Link to documentation](top-extensions-node-js-test-framework.md)

2. [PLANNED DEPRECATION - DO NOT USE] C# Test Framework (portalfx-test)

The C# test framework is on the path to being deprecated.  It is not recommended for partners to use.  Existing users are recommended to migrate to the AzurePortal-Test typescript test framework.  The C# test framework is in maintenance mode and will **only get security fixes** (no more product fixes).

Deprecation timeline:
- June 2023 - Announcement of planned deprecation.  No more product fixes, only security fixes.
- Dec 2023 - Microsoft.Portal.TestFramework nuget package will no longer be published.  Microsoft.Portal.TestFramework.CSharp will continue to be published.
- June 2024 - The C# test framework code will no longer be maintained.  Microsoft.Portal.TestFramework.CSharp will no longer be published.

[Link to documentation](top-extensions-csharp-test-framework.md)

