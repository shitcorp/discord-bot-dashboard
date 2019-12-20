// Sending Server Admins a message -> button

$(".sendServerAdminMessageToActivateButton").click(function () {
   $(".sendServerAdminMessageConfirmButton").removeAttr("disabled");
    $(".sendServerAdminMessageToActivateButton").attr("disabled");
});

// Enable Maintenance Button and XMLHttpRequest

$("#enableButtonForMaintanance").click(function () {
    $("#maintenanceActivatingButton").removeAttr("disabled");
    $(this).hide();
    $(".brMaintenance").hide();
});
