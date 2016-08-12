var loginButton = document.getElementById('login-button');
var form = document.getElementsByTagName('form')[0];
var authError = document.getElementById('auth-error');
form.onsubmit = function () { return false };

loginButton.onclick = function() {
    login();
};


function login() {
    var xdr = getXDomainRequest();
    var params = "";
    var fields = document.getElementsByClassName('form-control');
    for (var i=0; i < fields.length; i++)
	params+= (i != fields.length - 1) ? fields[i].getAttribute('id')+"="+fields[i].value+"&" : fields[i].getAttribute('id')+"="+fields[i].value;


    xdr.onload = function() {
	if (JSON.parse(xdr.responseText).success === true) {
	    localStorage.setItem("titchToken", JSON.parse(xdr.responseText).token);
	    document.body.style.opacity = 0;
	    setTimeout(function(){
		document.body.innerHTML = '<h1 id="registered"> You are connected</h1>';
		document.body.style.opacity = 1;
	    }, 500);
	    setTimeout(function(){
		document.body.style.opacity = 0;
	    }, 1000);
	    setTimeout(function(){
		window.location.href = "http://steven-boehm.cloudapp.net/";
	    }, 1500);
	} else if (JSON.parse(xdr.responseText).success === false ) {
	    authError.style.display = "block";
	    authError.innerHTML = JSON.parse(xdr.responseText).message;
	    authError.onclick = function() {
		authError.style.display = "none";
	    }
	}
    }

    xdr.open("POST", "http://steven-boehm.cloudapp.net:443/api/authenticate", true);
    xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xdr.send(params);
}

