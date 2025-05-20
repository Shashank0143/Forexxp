const mongoose = require('mongoose');

const signUpBrokerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true,
    },
    officialemail: {
        type: String,
        required: true,
    },
    supportemail: {
        type: String,
        required: true,
    },
    personalphone: {
        type: String,
        required: true,
    },
    customerphone: {
        type: String,
        required: true,
    },
    websiteUrl: {
        type: String,
        required: true,
    },
    crmLoginUrl: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    availableLicenses: {
        type: [String],
        required: true
    }

})

signUpBrokerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

signUpBrokerSchema.set('toJSON', {
    virtuals: true,
});

exports.SignUpBroker = mongoose.model('SignUpBroker', signUpBrokerSchema);
exports.signUpBrokerSchema = signUpBrokerSchema;
