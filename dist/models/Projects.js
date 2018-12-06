"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});
exports.default = mongoose.model('Projects', ProjectSchema);
//# sourceMappingURL=Projects.js.map