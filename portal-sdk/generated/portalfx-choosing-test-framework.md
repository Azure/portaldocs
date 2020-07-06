* [Choosing the right test Framework](#choosing-the-right-test-framework)


<a name="choosing-the-right-test-framework"></a>
# Choosing the right test Framework

The Ibiza team supports two different end to end test frameworks; a C# based test framework and a typescript based test framework. Partners can choose either of the test frameworks for developing end to end tests. We are working towards making both the test frameworks open source. An open source approach will enable partners to leverage APIs that are contributed by other partners. Building a strong open source community around these test frameworks will help improve the development experience for the test frameworks.

1. C# Test Framework (portalfx-test)

C# based test-fx is fully supported by the Ibiza team. The C# is internally used for testing the Azure Portal (Shell). The C# test framework is available for partners to view the code contribute features and bug fixes. 

[Link to documentation](portalfx-test.md)

1. Typescript Test Framework (msportalfx-test)

We have partnered with the IaaS team to develop an open-source typescript test framework. In fact, we are building an end to end test suite for our own extensions against this test framework. As part of developing this test framework we are building certain abstractions such as ‘open blade’ and ‘Navigate to settings blade’ that can be useful for testing your extensions too. The release of the typescript test framework is already decoupled from the release of SDK so partners can pick up latest version of it without recompiling their extension against a newer version of the Ibiza SDK.

[Link to documentation](msportalfx-test.md)

Comparison of test-frameworks:

- Maturity (Number of Selector APIs) : C# > typescript
- [Built on Selenium webdriver open standard](http://www.seleniumhq.org/projects/webdriver/) : Both Supported by Ibiza
- Documentation for Typescript test framework is more up to date than C# test framework
- Browser Support: Both support Chrome.  C# also has limited support for Firefox and IE.
- ARM API support:  MsPortalFx-Test has limited support for directly calling ARM to create/delete resources.  
- Test Execution Speed: typescript is 20% faster
- Distributed independently from SDK: Both
- Open Source contribution Model: Actively working on moving Typescript based test-fx to open source contribution model. We are investigating dev work to move C# based test-fx to open source contribution Model.