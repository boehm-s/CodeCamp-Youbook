var mem = {
    lessonTitle : document.getElementById('lessonTitle_'),
    lessonCategory : document.getElementById('lessonCategory_'),
    
    getLessonTitle : function() {
	return this.lessonTitle.innerHTML;
    },

    setLessonTitle : function(title) {
	this.lessonTitle.innerHTML = title;
    },

    getLessonCategory : function() {
	return this.lessonCategory.innerHTML;
    },

    setLessonCategory : function(categ) {
	this.lessonCategory.innerHTML = categ;
    }
}


var lessonShape = {
    form: document.getElementById('lessonShapeForm'),
    name: document.getElementById('lessonName'),
    category: document.getElementById('lessonCategory'),
    viewNumber: document.getElementById('viewNumber'),
    submitButton: document.getElementById('submitLessonShape'),

    getViewNumber : function() {
	return (this.viewNumber.value <= 5) ? this.viewNumber.value : 5;
    },

    submit : function() {
	mem.setLessonTitle(this.name.value);
	mem.setLessonCategory(this.category.value);
	
	lessonViews.create(this.getViewNumber());
	lessonViews.setTitle(this.name.value);

	lessonViews.setBrowseInputFormat();
	this.form.remove();
	forms.setRadioInputs();
	forms.handleVideoForm();
    }
}

var lessonViews = {
    container: document.getElementById('viewContainer'),
    title: document.getElementById('lessonTitle'),
    radioInputs: document.getElementsByClassName('radioInput'),
    validateInput: document.getElementById('validateLesson'),

    create: function(number) {
	for (var i=0; i < number; i++)
            this.container.innerHTML+= this.addView(i+1);
    },

    addView: function(viewNumber) {
	return '<div class="view"> <h3 class="viewTitle"> '+viewNumber+' </h3> <div class="chooseFile"> <iframe name="foo'+viewNumber+'" style="display:none;"></iframe> <form id="form'+viewNumber+'" method="POST" action="http://steven-boehm.cloudapp.net:443/api/storeFile" enctype="multipart/form-data" target="foo'+viewNumber+'">        <input type="hidden" name="category" class="hiddenCategName"/> <input type="hidden" name="lessonName" class="hiddenLessonName">         <label>Titre de la vue : <input type="text" name="viewTitle"/> </label> <h4>Choisissez le type de fichier que vous voulez insérer :</h4> <label class="radio"> <input type="radio" name="chooseFile" value="audio" class="radioInput"/>Fichier Audio </label> <label class="radio"> <input type="radio" name="chooseFile" value="video" class="radioInput"/>Fichier Video </label> <label class="radio"> <input type="radio" name="chooseFile" value="pdf" class="radioInput"/>Fichier PDF </label> <label class="radio"> <input type="radio" name="chooseFile" value="img" class="radioInput"/>Image </label> <label class="btn btn-file btn-lg btn-default">Browse <input type="file" multiple="" size="10" accept=".mp3" style="display: none" name="file" class="browseFile"/> </label> <input type="text" class="videoURL" placeholder="indiquez l\'URL ici" name="videoUrl"/> <div class="chooseText"> <h4>Ajoutez du texte supplémentaire ou des instructions ci-dessous :</h4> <textarea name="additionalText" form="form'+viewNumber+'" placeholder="entrez votre texte ici" class="form-control"></textarea> </div> </form> </div> </div>';
    },

    setTitle: function(title) {
	this.title.innerHTML = '<strong> Titre : </strong>' + title;
    },
    
    setBrowseInputFormat: function() {
	var _rInputs = this.radioInputs;
	var acceptObj = {
	    "video": [".mp4", ".avi", ".mpg", ".mpeg", ".wmv"],
	    "audio": [".mp3"],
	    "pdf": [".pdf"],
	    "img": [".png", ".jpg", ".jpeg", ".bmp", ".gif"]
	}
	for ( var i = 0; i < _rInputs.length; i++ ) (function(i) {
	    _rInputs[i].onclick = function() {
		var browseButton = _rInputs[i].parentNode.parentNode.getElementsByClassName('browseFile')[0];
		browseButton.setAttribute('accept', acceptObj[_rInputs[i].getAttribute('value')]);
	    }
	})(i);
    },
    
    submit: function() {
	var lesson = {}, obj;

	lesson.category = mem.getLessonCategory();
	lesson.title = mem.getLessonTitle();
	lesson.views = [];

	forms.submit(lesson);

	this.sendLesson(lesson);
	quizz.submit();
    },
    
    sendLesson: function(lesson) {
	var xdr = getXDomainRequest();
	xdr.onload = function() {
            if (xdr.status == 200)
		console.log(xdr.responseText);
            else if (xdr.status == 400)
		alert('There was an error 400');
	    else 
		alert('something else other than 200 was returned');
	};

	xdr.open("POST", "http://steven-boehm.cloudapp.net:443/api/lessons", true);
	xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xdr.setRequestHeader("x-access-token", localStorage.titchToken);
	xdr.send('lessonObj='+JSON.stringify(lesson)+'&title='+lesson.title+'&category='+lesson.category+'&QCM='+quizz.name);
	
    }
}

var forms = {
    container: document.getElementsByTagName('form'),
    radioInputs: null,

    setRadioInputs: function() {
	this.radioInputs = document.getElementsByClassName('radioInput');
    },
    submit: function(lesson) {
	var forms = this.container, f;
	for (var i=0; i < forms.length; i++) {
            obj = {};
            obj.viewTitle = forms[i].querySelectorAll('input[name="viewTitle"]')[0].value;
            obj.additionalText = forms[i].getElementsByTagName('textarea')[0].value;
	    f = forms[i].querySelectorAll('input[type="file"]')[0].value.split('\\');
            obj.file = f[f.length - 1];
	    obj.fileType = forms[i].querySelector('input[type="radio"]:checked').value;
	    obj.videoUrl = forms[i].getElementsByClassName('videoURL')[0].value;
            lesson.views.push(obj);
	    forms[i].getElementsByClassName('hiddenCategName')[0].setAttribute('value', mem.getLessonCategory());
	    forms[i].getElementsByClassName('hiddenLessonName')[0].setAttribute('value', mem.getLessonTitle());

            forms[i].submit();
	}
    },
    handleVideoForm: function() {
	var _ = this;
	for ( var i = 0; i < _.radioInputs.length; i++ ) (function(i){ 
	    _.radioInputs[i].onclick = function() {
		if (_.radioInputs[i].value === "video") {
		    _.radioInputs[i].parentNode.parentNode.getElementsByClassName('videoURL')[0].style.display = "block";
		} else {
		    _.radioInputs[i].parentNode.parentNode.getElementsByClassName('videoURL')[0].style.display = "none";	  
		}
	    }
	})(i);
    }
}


var quizz = {
    json: null,
    name: null,
    errorQuizz:  document.getElementById("errorquizz"),
    file: document.getElementById("File"),
    modal: document.getElementById('quizzModal'),
    exitModalButton: document.getElementById('exitModal'),
    showModalButton: document.getElementById('fileShape'),


    showModal: function() {
	this.modal.style.display = "flex";
    },

    hideModal: function() {
	this.modal.style.display = "none";
    },

    uploadFile: function() {
	var txt = "";
	if ('files' in this.file) {
	    var _file = this.file.files[0];
	    if ('name' in _file) {
		var ext = _file.name.split('.').pop();
		(ext === "json") ? this.getJson(_file) : this.convertCSV(_file);
	    }
	}
    },
    getJson: function(file) {
	var reader = new FileReader();
	var _ = this;
	reader.onload = function() {
            _.json = JSON.parse(this.result);
            _.name = _.json.name;
            if(!_.checkJson()) {
		_.file = "";
		_.json = null;
		_.errorQuizz.classList.remove("hidden");
            }
	}
	reader.readAsText(file);
    },
    checkJson: function (){
	var qcmok = 1;
	if (this.json["name"] != null && this.json["category"] != null){
            if(this.json["QCM"]){
		for (question in this.json["QCM"]){
                    if (this.json["QCM"][question]["question"] && this.json["QCM"][question]["propositions"] && this.json["QCM"][question]["answer"]){
			if (this.json["QCM"][question]["propositions"][this.json["QCM"][question]["answer"] - 1] === null)
			    return 0; } else return 0; }} else return 0; } else return 0;
	return 1;
    },

    convertCSV: function (file) {
	Papa.parse(file, {
            complete: function(res){
		this.json = res["data"];
		if (!this.checkJson()) {
		    this.file.value = "";
		    this.json = null;
		    this.errorQuizz.classList.remove("hidden");
		}
            }
	});
    },
    
    submit: function() {
	var xdr = getXDomainRequest();
	xdr.onload = function() {
            if (xdr.status == 200) {
		console.log(xdr.responseText);
            } else if (xdr.status == 400) {
		alert('There was an error 400');
            } else {
		console.log(xdr.responseText);
		alert('something else other than 200 was returned');
            }
	};
	var JsonToSend = JSON.stringify(this.json);
	xdr.open("POST", "http://steven-boehm.cloudapp.net:443/api/qcm", true);
	xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xdr.setRequestHeader("x-access-token", localStorage.titchToken);
	xdr.send('qcm='+JsonToSend);
    }
}


lessonShape.submitButton.onclick = function() {
    lessonShape.submit();
}

lessonViews.validateInput.onclick = function() {
    lessonViews.submit();
}

quizz.exitModalButton.onclick = function() {
    quizz.hideModal();
}

quizz.showModalButton.onclick = function() {
    quizz.showModal();
}


