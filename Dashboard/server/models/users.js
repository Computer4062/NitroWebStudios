import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	role: {type: String, required: true, default: "editor"}

}, {
	collection: 'users',
	timestamps: true
});

export const Account = mongoose.models.Account || mongoose.model('Account', accountsSchema);