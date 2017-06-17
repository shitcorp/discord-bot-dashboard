// Sending the client object to the console output (for development)

$("#outputClientObjBtn").click(function () {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET","/outputClient",true);
    xmlhttp.send();

});