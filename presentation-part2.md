Modern Office 365, SharePoint & Cloud Development Ramp-Up
=========================================================
*Follow along at [github.com/andrewconnell/pres-modern-spdev-workshop](http://github.com/andrewconnell/pres-modern-spdev-workshop). This is just but one part of multiple parts that make up this workshop... [click here for all the parts that makeup this workshop](presentation.md).*

Part 2: Solution-Based Development
==================================
1. [Server-Side Object Model (SSOM)](#server-side-object-model)
1. [Features](#features)
1. [Solutions](#features)


&laquo; **[back to top](#part-2-solution-based-development)** &raquo;

Server-Side Object Model
------------------------
- Oldest & most mature API for developers
- Microsoft discouraging it's use starting in SharePoint 2013



###Common Objects
- `SPSite`
- `SPWeb`
- `SPList` & `SPDocumentLibrary`
- `SPListItem`
- `SPFolder` & `SPFile`
- `SPContext`



DEMO: Server-side object model & farm solution
----------------------------------------------
- Using the [SSOM](#server-side-object-model) from the console



&laquo; **[back to top](#part-2-solution-based-development)** &raquo;

Features
========
*What is a SharePoint Feature?*

- Introduced in SharePoint 2007
- Atomic unit of functionality
- Primary way you get custom things integrated into SharePoint



What can you do with a Feature?
-------------------------------
- Add artifacts to sites
- Register new functionality in a site
- Add content to sites, lists & libraries
- Run arbitrary code



Features look like...
-----------------------------
- Folder with a `feature.xml` definition file
  - Describes the feature
  - References all parts & dependencies of the feature

````xml
<Feature xmlns="http://schemas.microsoft.com/sharepoint/"
         Id="86689158-7048-4421-AD21-E0DEF0D67C81"
         Title="Swamplander Contacts"
         Description="A sample feature that creates a contact list."
         Version="1.0.0.0"
         Scope="Web"
         Hidden="FALSE"
         ReceiverAssembly="SwamplanderContacts, Version=1.0.0.0, Culture=neutral, PublicKeyToken=56170dd0494afccc"
         ReceiverClass="SwamplanderContacts.FeatureReceiver"
         ImageUrl="SwamplanderContacts/FeatureIcon.gif">
  <ElementManifests>
    <ElementManifest Location="elements.xml" />
  </ElementManifests>
</Feature>
````



Feature element manifests look like...
--------------------------------------
````xml
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
  <ListInstance Id="SwampContacts"
    FeatureId="00BFEA71-7E6D-4186-9BA8-C047AC750105"
    TemplateType="105"
    Title="Swampland Contacts"
    Url="SwampContacts"
    OnQuickLaunch="TRUE" />
</Elements>
````



Features can contain...
-----------------------------
Many types of customizations for sites defined declaratively in features

- Site columns & content types
- List / library templates & instances
- Provision files to the site (including web part definitions)
- Register event receivers
- Register & associate workflows on sites & lists
- Register menu & ribbon extensions



When all else fails, use code!
------------------------------
- First register it with the Feature using the `ReceiverAssembly` & `ReceiverClass` attributes in the feature's definition / manifest file
  - Visual Studio's developer tools do it for you

````csharp
public class FeatureReceiver : SPFeatureReceiver {
  public override void FeatureInstalled(SPFeatureReceiverProperties props) {
  }

  public override void FeatureActivated(SPFeatureReceiverProperties props) {
    SPWeb site = props.Feature.Parent as SPWeb;
    if (site != null) {
      site.Title = "Feature Activated";
      site.SiteLogoUrl = @"_layouts/images/Swampland/SiteIcon.gif";
      site.Update();
    }
  }
 
  public override void FeatureDeactivating(SPFeatureReceiverProperties props) {
    SPWeb site = props.Feature.Parent as SPWeb;
    if (site != null) {
      site.Title = "Feature Deactivated";
      site.SiteLogoUrl = "";
      site.Update();
      SPList list = site.Lists.TryGetList("Swampland Contacts");
      if (list != null) {
        list.Delete();
      }
    }
  }

  public override void FeatureUninstalling(SPFeatureReceiverProperties props) {
  }
}
````



&laquo; **[back to top](#part-2-solution-based-development)** &raquo;

Solutions
=========
*What is a SharePoint Solution?*
- Introduced in SharePoint 2007
- SharePoint's installer framework
- SharePoint 2010 defined two types of solutions
  - Farm solution / aka: fully-trusted solution
  - Sandboxed solution / aka: partially-trusted solution



Solutions look like...
----------------------
- Package of files compressed as Microsoft Cabinet file
  - Saved as `*.wsp`
- Contains all files that should be deployed to SharePoint server
- Contains definition file `manifest.xml` describing the solution & it's contents

````xml
<?xml version="1.0" encoding="utf-8"?>
<Solution xmlns="http://schemas.microsoft.com/sharepoint/"
          SolutionId="07752644-45b2-41c3-9eaa-2d58a1ac31b9"
          SharePointProductVersion="15.0"
          DeploymentServerType="WebFrontEnd"
          ResetWebServer="TRUE">
  <FeatureManifests>
    <FeatureManifest Location="SwampContacts\Feature.xml" />
  </FeatureManifests>
  <TemplateFiles>
    <TemplateFile Location="IMAGES\Swampland\FeatureIcon.gif" />
    <TemplateFile Location="IMAGES\Swampland\SiteIcon.gif" />
  </TemplateFiles>
  <Assemblies>
    <Assembly Location="SwamplandContacts.dll"
              DeploymentTarget="GlobalAssemblyCache" />
  </Assemblies>
</Solution>
````



Solutions can contain...
------------------------
- Features
  - Including all their dependencies
- `*.dll` deployed to site's BIN or server's GAC
- Any file to anywhere within the `SharePointRoot`
  - `c:\Program Files\Common Files\Microsoft Shared\web server extentions\15`
  - `c:\Program Files\Common Files\Microsoft Shared\web server extentions\16`



Types of solutions
------------------
The type of solution is dictated how it is **deployed**, *not* what it contains
- Farm solutions / *aka: fully-trusted solutions*
- Sandboxed solutions / *aka: partially-trusted solutions*



Farm solutions
--------------
- Only available in on-premises deployments
  - Not available in Office 365
- Custom code runs with full permissions (aka: full trust)
- Ideal scenarios
  - Deploying code that uses the [SSOM](#server-side-object-model)
  - Branding solutions
  - Admin page customizations (Central Admin / Site Settings)
  - Application pages
  - Timer jobs



###Farm solution lifecycle
````powershell
$solutionPackage = "SwamplandSolution.wsp"
$solutionPath = "SwamplandProject\packages\$solutionPackage"
````
1. Upload to server via PowerShell cmdlet: `Add-SPSolution`
````powershell
Add-SPSolution -LiteralPath $solutionPath
````
1. Deploy to servers via Central Administration / PowerShell cmdlet: `Install-SPSolution`
````powershell
Install-SPSolution -Identity $solutionPackage [-GACDeployment] [-Local]
````
1. Upgade existing solutions using PowerShell cmdlet: `Upgrade-SPSolution`
````powershell
Update-SPSolution -Identity $solutionPackage -LiteralPath $solutionPath [-GACDeployment] [-Local]
````



DEMO: Farm solutions
--------------------
- Creating a web part
- Deploying & updating a solution



Sandboxed solutions
-------------------
Think **isolated solutions** rather than **sandboxed solutions**... don't get confused with sandboxed environments. Every SharePoint farm & server has a sandbox process.

- Compromise between developers, customers & administrators
- Compromise between on-premises & hosted deployments
- Uploaded & deployed via browser by site collection admin
- Compromise with limited [SSOM](#server-side-object-model) in exchange for no administrator management



###Clarifying the *deprecated* sandboxed solution confusion...
Confusing documentation on MSDN:

> While developing sandboxed solutions that contain only declarative markup and JavaScript -- which we call no-code sandboxed solutions (NCSS)-- is still viable, we have deprecated the use of custom managed code within the sandboxed solution.

> &raquo; *[MSDN: Apps for SharePoint compared with SharePoint Solutions](http://msdn.microsoft.com/library/office/jj163114)*

- Only user-code is deprecated... no `*.dll` in sandboxed solutions
- Can be enabled in on-premises deployments, but off by default



Sandboxed solutions can...
--------------------------
- Include features
- Create list/library templates & instances
- Create event handlers on lists, libraries & sites
  - *But only on-premises as this requires user code*
- Create site columns & content types
- Provision files via modules
- Deploy Web Parts
  - *But only on-premises as this requires user code*
- Deploy custom declarative workflows
- Register custom workflow actions for SharePoint Designer



DEMO: Sandboxed solution
------------------------
- Creating site collection scoped resources
- Creating a list

&laquo; **[back to top](#part-2-solution-based-development)** &raquo;
