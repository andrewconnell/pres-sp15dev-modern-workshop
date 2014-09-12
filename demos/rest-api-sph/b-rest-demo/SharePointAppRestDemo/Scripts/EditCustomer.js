var dialog;

$(onPageLoad);

function onPageLoad() {
	dialog = window.frameElement;
	var command = dialog.dialogArgs.command;
	
	if (command == "Add") {
		$("#txtFirstName").focus();
	}

	if (command == "Update") {
		loadCustomer();
		$("#txtFirstName").focus().select();
	}

	$("#cmdOK").click(onSave);
	$("#cmdCancel").click(onCancel);
}

function loadCustomer() {

	var args = dialog.dialogArgs;
	var Id = args.Id;
	var etag = args.etag;
	var FirstName = args.FirstName;
	var LastName = args.LastName;
	var WorkPhone= args.WorkPhone;

	$("#txtFirstName").val(FirstName);
	$("#txtLastName").val(LastName);
	$("#txtWorkPhone").val(WorkPhone);


	//var table = $("#customerEditTable");
	//table.prepend($("<tr><td>ID:</td><td>" + Id + "</td></tr>"));
	//table.prepend($("<tr><td>E-Tag:</td><td>" + etag + "</td></tr>"));

}

function onSave() {

	var args = dialog.dialogArgs;

	var returnValue = {
		Id: args.Id,
		etag: args.etag,
		FirstName: $("#txtFirstName").val(),
		LastName: $("#txtLastName").val(),
		WorkPhone: $("#txtWorkPhone").val()
	}

	dialog.commonModalDialogClose(SP.UI.DialogResult.OK, returnValue);
}

function onCancel() {
	dialog.commonModalDialogClose(SP.UI.DialogResult.cancel);
}