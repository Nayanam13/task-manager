const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    status: {
        type: String,
        enum: ['TODO', 'INPROGRESS','COMPLETED'],
        default: 'TODO'
    },
    userId: Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
