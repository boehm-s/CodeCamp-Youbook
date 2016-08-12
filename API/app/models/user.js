// app/models/user.js

var mongoose          = require('mongoose');

var crypto            = require('crypto');
var uuid              = require('node-uuid');
var Schema            = mongoose.Schema;
var ObjectId          = Schema.ObjectId;
var SALT_WORK_FACTOR  = 10;


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


var UserSchema = new Schema({
    profile: {
	firstName: {
	    type: String
	},
	lastName: {
	    type: String
	},
	username: {
	    type: String
	},
	email: {
	    type: String,
	    required: true, 
	    index: { unique: true },
	    validate: [validateEmail, 'Entrez une adresse email correcte'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Entrez une adresse email correcte']
	},
	sellerId: {
	    type: String,
	    required: true
	},
	salt: {
	    type: String,
	    required: true,
	default: uuid.v1 
	},
	passwdHash: {
	    type: String, 
	    required: true 
	},
	admin: {
	    type: Boolean,
	default: false
	}
    },
    validatedLessons: [String],
    inProgressLessons: [String],
    badges: [String],
    validatedSkills: [String],
    inProgressionSkills: [String]
});

var hash = function(passwd, salt) {
    return crypto.createHmac('sha256', salt).update(passwd).digest('hex');
};

UserSchema.methods.setPassword = function(passwordString) {
    this.profile.passwdHash = hash(passwordString, this.profile.salt);
};

UserSchema.methods.isValidPassword = function(passwordString) {
    return this.profile.passwdHash === hash(passwordString, this.profile.salt);
};

module.exports = mongoose.model('User', UserSchema);
