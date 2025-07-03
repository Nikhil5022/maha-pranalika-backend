const mongoose = require('mongoose');

const msmeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    basic_info: {
        client_name: { type: String, required: true, trim: true },
        primary_product: { type: String, required: true, trim: true },
        total_no_of_leads: { type: String, required: true, trim: true },
        name_of_lead: { type: String, required: true, trim: true },
        type_of_organisation: [{ type: String, trim: true }],
        lead_entity: { type: String, required: true, trim: true },
        doe: { type: Date, required: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        pincode: { type: String, required: true, trim: true }
    },
    contact_info: {
        contact_person: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true }
    },
    cluster_details: {
        no_of_participating: { type: String, required: true, trim: true },
        average_years: { type: String, required: true, trim: true },
        total_employment: { type: String, required: true, trim: true },
        common_challenges: [{ type: String, trim: true }],
        key_interventions: { type: String, required: true, trim: true }
    },
    documents: {
        issues: [{ type: String, trim: true }]
    },
    declaration: {
        signature: { type: String, required: true, trim: true },
        declaration_date: { type: Date, required: true },
        declared: { type: Boolean, required: true }
    },
    payment: {
        orderId: { type: String, trim: true },
        paymentId: { type: String, trim: true },
        signature: { type: String, trim: true },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        amount: { type: Number },
        currency: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('MSMECluster', msmeSchema);
