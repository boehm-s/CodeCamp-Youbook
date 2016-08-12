var registerButton = document.getElementById('register-button');
var uploadButton = document.getElementById('upload-button');
var imgPreview = document.getElementById('uploaded-picture');
var form = document.getElementsByTagName('form')[0];
var fields = {}; 

Array.prototype.slice.call(document.getElementsByClassName('form-control'),0).map(function(el){ 
    var key = el.attributes.id.value.replace(/\-./g, function(v){return v.substring(1).toUpperCase()});
    fields[key] = el; return fields;
});


registerButton.onclick = function() {
    if (checkFields(fields) === true)
	register(fields);
}

form.onsubmit = function () { return false };

function checkFields(fields) {
    var ret = true;
    var conf = [fields.email, fields.emailConfirmation, fields.password, fields.passwordConfirmation];
    for (var i = 0; i < conf.length; i += 2) {
	if (conf[i].value !== conf[i + 1].value) {
	    ret = false;
	    conf[i+1].placeholder = "This field and the precedent one must be identical"
	    conf[i+1].value = "";
	    conf[i+1].style.background = "rgba(255, 0, 0, 0.4)";
	    conf[i+1].onclick = function() {
		if (this.style.background != "#FFF") {
		    this.placeholder = "";
		    this.style.background = "#FFF";
		}
	    }
	}
    } 
    return (ret);
}




function register(fields) {
    var xdr = getXDomainRequest();
    var params = "", j = 0;
    for (i in fields) {
	params+= (j != Object.size(fields) - 1) ? i+"="+fields[i].value+"&" : i+"="+fields[i].value;
	j++;
    }

    xdr.onload = function() {
	localStorage.setItem("titchToken", JSON.parse(xdr.responseText).token);
	document.body.style.opacity = 0;
	setTimeout(function(){
	    document.body.innerHTML = '<h1 id="registered"> you have been successfully registered </h1>';
	    document.body.style.opacity = 1;
	}, 500);
	setTimeout(function(){
	    document.body.style.opacity = 0;
	}, 1000);
	setTimeout(function(){
	    window.location.href = "http://steven-boehm.cloudapp.net/connection";
	}, 1500);
    }

    xdr.open("POST", "http://steven-boehm.cloudapp.net:443/api/users", true);
    xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xdr.send(params);
}

