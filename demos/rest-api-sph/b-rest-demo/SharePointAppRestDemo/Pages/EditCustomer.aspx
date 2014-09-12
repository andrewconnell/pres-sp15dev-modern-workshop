<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
	<link rel="Stylesheet" type="text/css" href="../Content/App.css" />   
	<SharePoint:ScriptLink name="SP.UI.Dialog.js" runat="server" Defer="false" LoadAfterUI="true" Localizable="false" /> 
    <SharePoint:ScriptLink name="sp.js" runat="server" Defer="false" LoadAfterUI="true" Localizable="false" />

    <script type="text/javascript" src="../Scripts/jquery-1.6.2.js"></script>
    <script type="text/javascript" src="../Scripts/EditCustomer.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">

  <div class="dialog_input_section" >
		
		<table id="customerEditTable">
      <tr><td>First Name:</td><td><input id="txtFirstName" /></td></tr>
      <tr><td>Last Name:</td><td><input id="txtLastName" /></td></tr>
      <tr><td>Work Phone:</td><td><input id="txtWorkPhone" /></td></tr>
    </table>
  
  </div>

  <div class="dialog_button_section">
		<input type="button" id="cmdOK" value="Save" class="ms-ButtonHeightWidth"  />
		<input type="button" id="cmdCancel" value="Cancel" class="ms-ButtonHeightWidth"  />
	</div>


</asp:Content>
