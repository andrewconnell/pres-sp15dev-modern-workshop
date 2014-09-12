
$(function () {
    // register event handlers on page
    $("#cmdAddNewCustomer").click(onAddCustomer);
    $("#results").append($("<img>", { src: "_layouts/images/gears_anv4.gif" }));

    // retrieve customer items
    getCustomers();
});

function getCustomers() {
    // clear results and add spinning gears icon
    $("#results").empty();
    $("<img>", { "src": "/_layouts/images/GEARS_AN.GIF" }).appendTo("#results");

    // begin work to call across network
    var requestUri = _spPageContextInfo.webAbsoluteUrl +
                  "/_api/Web/Lists/getByTitle('Customers')/items/" +
                  "?$select=Id,FirstName,Title,WorkPhone" +
                  "&$orderby=Title,FirstName";

    // execute AJAX request 
    var requestHeaders = {
        "accept": "application/json;odata=verbose"
    }
    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onDataReturned,
        error: onError
    });
}

function onDataReturned(data) {

    $("#results").empty();

    var odataResults = data.d.results;

    // set rendering template
    var tableHeader = "<thead>" +
                      "<td>Last Name</td>" +
                      "<td>First Name</td>" +
                      "<td>Work Phone</td>" +
                      "<td>&nbsp;</td>" +
                      "<td>&nbsp;</td>" +
                      "<td>&nbsp;</td>" +
                    "</thead>";

    var table = $("<table>", { id: "customersTable" }).append($(tableHeader));

    var renderingTemplate = "<tr>" +
                              "<td>{{>Title}}</td>" +
                              "<td>{{>FirstName}}</td>" +
                              "<td>{{>WorkPhone}}</td>" +
                              "<td><a href='javascript: onShowCustomerDetail({{>Id}});'><img src='_layouts/images/DETAIL.gif' alt='Show Detail' /></a></td>" +
                              "<td><a href='javascript: onUpdateCustomer({{>Id}});'><img src='_layouts/images/EDITITEM.gif' alt='Edit' /></a></td>" +
                              "<td><a href='javascript: onDeleteCustomer({{>Id}});'><img src='_layouts/images/DELITEM.gif' alt='Delete' /></a></td>" +
                            "</tr>";


    $.templates({ "tmplTable": renderingTemplate });
    table.append($.render.tmplTable(odataResults));
    $("#results").append(table);

}

function onShowCustomerDetail(customer) {

    var customerItemEditUrl = _spPageContextInfo.webAbsoluteUrl +
                            "/Lists/Customers/DispForm.aspx?ID=" + customer;

    var dialogOptions = {
        url: customerItemEditUrl,
        title: "Customer Detail",
        dialogReturnValueCallback: getCustomers
    };

    SP.UI.ModalDialog.showModalDialog(dialogOptions);

}

function onAddCustomer(event) {

    var dialogArgs = {
        command: "Add"
    };

    var dialogOptions = {
        url: "EditCustomer.aspx",
        title: "Add New Customer",
        width: "480px",
        args: dialogArgs,
        dialogReturnValueCallback: saveNewCustomer
    };

    SP.UI.ModalDialog.showModalDialog(dialogOptions);

}

function saveNewCustomer(dialogResult, returnValue) {

    if (dialogResult == SP.UI.DialogResult.OK) {

        // get data from dialog for new customer
        var LastName = returnValue.LastName;
        var FirstName = returnValue.FirstName;
        var WorkPhone = returnValue.WorkPhone;

        var requestUri = _spPageContextInfo.webAbsoluteUrl +
                  "/_api/Web/Lists/getByTitle('Customers')/items/";

        var requestHeaders = {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        }

        var customerData = {
            __metadata: { "type": "SP.Data.CustomersListItem" },
            Title: LastName,
            FirstName: FirstName,
            WorkPhone: WorkPhone
        };

        requestBody = JSON.stringify(customerData);

        $.ajax({
            url: requestUri,
            type: "Post",
            contentType: "application/json;odata=verbose",
            headers: requestHeaders,
            data: requestBody,
            success: onSuccess,
            error: onError
        });

    }

}

function onDeleteCustomer(customer) {

    var requestUri = _spPageContextInfo.webAbsoluteUrl +
                  "/_api/Web/Lists/getByTitle('Customers')/items(" + customer + ")";

    var requestHeaders = {
        "accept": "application/json;odata=verbose",
        "X-RequestDigest": $("#__REQUESTDIGEST").val(),
        "If-Match": "*"
    }

    $.ajax({
        url: requestUri,
        type: "DELETE",
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

}

function onUpdateCustomer(customer) {

    // begin work to call across network
    var requestUri = _spPageContextInfo.webAbsoluteUrl +
                  "/_api/Web/Lists/getByTitle('Customers')/items(" + customer + ")";

    // execute AJAX request 
    var requestHeaders = {
        "accept": "application/json;odata=verbose"
    }
    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onCustomerReturned,
        error: onError
    });
}

function onCustomerReturned(data) {

    var dialogArgs = {
        command: "Update",
        Id: data.d.Id,
        LastName: data.d.Title,
        FirstName: data.d.FirstName,
        WorkPhone: data.d.WorkPhone,
        etag: data.d.__metadata.etag
    };

    var dialogOptions = {
        url: "EditCustomer.aspx",
        title: "Update Customer",
        width: "480px",
        args: dialogArgs,
        dialogReturnValueCallback: updateCustomer
    };

    SP.UI.ModalDialog.showModalDialog(dialogOptions);


}

function updateCustomer(dialogResult, returnValue) {

    if (dialogResult == SP.UI.DialogResult.OK) {
        var Id = returnValue.Id;
        var FirstName = returnValue.FirstName;
        var LastName = returnValue.LastName;
        var WorkPhone = returnValue.WorkPhone;
        var etag = returnValue.etag;

        var requestUri = _spPageContextInfo.webAbsoluteUrl +
                  "/_api/Web/Lists/getByTitle('Customers')/items(" + Id + ")";

        var requestHeaders = {
            "accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": etag
        }

        var customerData = {
            __metadata: { "type": "SP.Data.CustomersListItem" },
            Title: LastName,
            FirstName: FirstName,
            WorkPhone: WorkPhone
        };

        requestBody = JSON.stringify(customerData);


        $.ajax({
            url: requestUri,
            type: "POST",
            contentType: "application/json;odata=verbose",
            headers: requestHeaders,
            data: requestBody,
            success: onSuccess,
            error: onError
        });

    }

}

function onSuccess(data, request) {
    getCustomers();
}

function onError(error) {
    $("#results").empty();
    $("#results").text("ADD ERROR: " + JSON.stringify(error));
}

