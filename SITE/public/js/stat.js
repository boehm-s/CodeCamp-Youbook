Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};


var data = {
    allUsers: null,
    getAllUsers: function(callback) {
	var xdr = getXDomainRequest();
	var _ = this;
	xdr.onload = function() {
            if (xdr.status == 200) 
		_.allUsers = JSON.parse(xdr.responseText).users;
	    else 
		alert('something else other than 200 was returned');
	    callback();
	    };

	xdr.open("GET", "http://steven-boehm.cloudapp.net:443/api/users", true);
	xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xdr.setRequestHeader("x-access-token", localStorage.titchToken);
	xdr.send();
    }
}

var average = {
    inProgressLessonsByUser: function() { // nombre moyen de lessons en progres par utilisateur
	return data.allUsers
	    .map(function(curr) { return curr.inProgressLessons.length; })
	    .reduce(function(a, b) { return a + b; }) 
	    / data.allUsers.length;
    },
    validatedLessonsByUser: function() { // nombre moyen de lessons validees par utilisateur
	return data.allUsers
	    .map(function(curr) { return curr.validatedLessons.length })
	    .reduce(function(a, b) { return a + b; }) 
	    / data.allUsers.length;
    },
    badgeByUser: function() { // nombre moyen de badges par utilisateurs
	return data.allUsers
            .map(function(curr){return curr.badges.length})
            .reduce(function(a, b){return a + b})
            / data.allUsers.length;
    },
    validatedLessonsRate: function() { // pourcentage  de leçons validees sur leçons commencées et finies
	var j=1;
	return data.allUsers
            .map(function(curr){return curr.inProgressLessons.length})
            .map(function(curr, i){return data.allUsers[i].validatedLessons.length + curr})
            .map(function(curr, i, tab){if (curr !== 0) { return (data.allUsers[i].validatedLessons.length / curr)}})
            .clean(undefined)
            .reduce(function(a, b){j++; return (a+b)})
            / j * 100;
    },
    inProgressLessonsRate: function() { // pourcentage de leçons en progres sur leçons commencées et finies 
	var j=1;
	return data.allUsers
            .map(function(curr){return curr.inProgressLessons.length})
            .map(function(curr, i){return data.allUsers[i].validatedLessons.length + curr})
            .map(function(curr, i, tab){if (curr !== 0) { return (data.allUsers[i].inProgressLessons.length / curr)}})
            .clean(undefined)
            .reduce(function(a, b){j++; return (a+b)})
            / j * 100;
    }
};

var generalState = {
    container: document.getElementById('gStat'),
    fill: function(arr) {
	for (var i=0; i < arr.length; i++) {
	    this.container.innerHTML+= '<div class="statDiv"><div class="title">'+arr[i].title+'</div><div class="value">'+arr[i].value.toFixed(2)+'</div></div>';
	}
    }
}

var userSearch = {
    result: [],
    input: document.getElementById('userSearch'),
    resArea: document.getElementById('searchResult'),
    search: function(text) {
	this.result = [];
	for (var i = 0; i < data.allUsers.length; i++) {
	    if (data.allUsers[i].profile.email.indexOf(text) != -1)
		this.result.push(data.allUsers[i]);
	}
	console.log(this.result);
	this.display(this.result);
    },
    display: function(result) {
	this.resArea.innerHTML = "";
	for (var i = 0; i < result.length; i++) {
	    var tmp = result[i].profile;
	    this.resArea.innerHTML+= '<li><strong>'+ tmp.firstName + '  '+ tmp.lastName + '</strong>' + tmp.email + '</li>';
	}
    }
}

data.getAllUsers(function() {
    console.log(average.inProgressLessonsByUser());
    console.log(average.validatedLessonsByUser());

    var arr = [{title: "nombre moyen de lessons en progres par utilisateur", value:average.inProgressLessonsByUser() }, {title: "nombre moyen de lessons validees par utilisateur", value:average.validatedLessonsByUser() }, {title: "nombre moyen de badges par utilisateurs", value: average.badgeByUser()}, {title: "pourcentage  de leçons validees sur leçons commencées et finies", value:average.validatedLessonsRate() }, {title: "pourcentage de leçons en progres sur leçons commencées et finies", value: average.inProgressLessonsRate()}];

    generalState.fill(arr);
});

userSearch.input.oninput = function() {
    userSearch.search(this.value);
}

