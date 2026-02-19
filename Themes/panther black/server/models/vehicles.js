import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
	price: {type: Number, required: true},
	year: {type: Number, required: true},
	make: { type: String, required: true },
    model: { type: String, required: true },
	milleage: {type: Number},
	cylinders: {type: Number},
	motors: {type: Number},
	transmission: {type: String},
	type: {type: String, required: true},
	doors: {type: Number},
	color: {type: String, required: true},
	fuel: {type: String},
	description: {type: String},
	images: [String],
	_electric: {type: Boolean}

}, {collection: 'vehicles'});

export const Vehicle = mongoose.models.dealership || mongoose.model('dealership', vehicleSchema);