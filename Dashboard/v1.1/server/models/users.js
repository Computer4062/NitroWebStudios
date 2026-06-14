import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true},

	admin: {type: Boolean, required: true, default: false},
	//technician: {type: Boolean, required: true, default: false},

	profile_img: {type: String, required: false, default: "default.jpg"},
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},

	isVerified: {type: Boolean, requred: true, default: false},
	verificationToken: {type: String, default: null, select: false},
	verificationTokenExpires: Date
}, {
	collection: 'users',
	timestamps: true
});

export const Account = mongoose.models.Account || mongoose.model('Account', accountsSchema);