const { Schema } = require('mongoose');
const mongoose = require('mongoose')

const IssueShema = new Schema({
    _id: { type: String, required: true },
    project: { type: String, required: true, select: false },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: { type: String, default: new Date().toISOString() },
    updated_on: { type: String, default: new Date().toISOString() },
    created_by: { type: String, required: true },
    assigned_to: { type: String, default: "" },
    open: { type: Boolean, default: true },
    status_text: { type: String, default: "" }
});

const IssueModel = mongoose.model('Issue', IssueShema);

module.exports = IssueModel
