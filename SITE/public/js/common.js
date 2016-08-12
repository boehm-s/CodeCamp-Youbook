Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getXDomainRequest() {
    var xdr = null;

    if (window.XDomainRequest) {
	xdr = new XDomainRequest(); 
    } else if (window.XMLHttpRequest) {
	xdr = new XMLHttpRequest();
    } else {
	alert("Votre navigateur ne gère pas l'AJAX cross-domain !");
    }
    
    return xdr;
}
