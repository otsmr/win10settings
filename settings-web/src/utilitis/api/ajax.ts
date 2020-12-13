
export default function ajax (config: any) {

    if (!config.method) {
        config.method = true;
    }
    let sendString = "";
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (config.done) {
                config.done(JSON.parse(xmlhttp.responseText));
            }
        } 
        else if(xmlhttp.readyState == 4) {
            if(config.problem){
                config.problem({
                    message : "An error occured while connecting with Neutralino server!"
                });
            }
        }
    }
    
   if(typeof config.data != 'undefined')
        sendString = JSON.stringify(config.data);

    if (config.type == "GET") {
        xmlhttp.open("GET", config.url , config.method);
        xmlhttp.send();
    }
    
    if (config.type == "POST") {
        xmlhttp.open("POST", config.url, config.method);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(sendString);
    }



}