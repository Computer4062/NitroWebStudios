import mongoose from 'mongoose';

const accountsSchema = new mongoose.Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	role: {type: String, required: true, default: "editor"}

}, {collection: 'users'});

export const Account = mongoose.models.dealership || mongoose.model('dealership', accountsSchema);