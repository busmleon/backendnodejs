const mongoose = require('mongoose');

const testObjectSchema = mongoose.Schema({
    name: String,
    age: Number
});

module.exports = mongoose.model('TestObject', testObjectSchema);