import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
	price: {type: Number, required: true},
	year: {type: Number, required: true},
	make: { type: String, required: true },
    model: { type: String, required: true },
	draft: {type: Boolean, required: true},
	milleage: {type: Number},
	cylinders: {type: Number},
	motors: {type: Number},
	transmission: {type: String},
	type: {type: String},
	doors: {type: Number},
	color: {type: String},
	fuel: {type: String},
	description: {type: String},
	images: [String],
	_electric: {type: Boolean},
	featured: {type: Boolean}

}, {collection: 'vehicles'});

export const Vehicle = mongoose.models.dealership || mongoose.model('dealership', vehicleSchema);