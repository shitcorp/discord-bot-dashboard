// Sending the client object to the console output (for development)

$("#outputClientObjBtn").click(function () {

    var httpRequestClientObject = new XMLHttpRequest();

    httpRequestClientObject.open("GET","/outputClient",true);
    httpRequestClientObject.send();

});

// Try a new function with this request.
// Mainly for development usages.

$("#testNewFunctionBtn").click(function () {

    var httpRequestTestingNewFunction = new XMLHttpRequest();

    httpRequestTestingNewFunction.open("GET","/testingNewFunction",true);
    httpRequestTestingNewFunction.send();

});


// Sending Server Admins a message -> button

$(".sendServerAdminMessageToActivateButton").click(function () {
   $(".sendServerAdminMessageConfirmButton").removeAttr("disabled");
    $(".sendServerAdminMessageToActivateButton").attr("disabled");
});