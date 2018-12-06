import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name:{
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

export default mongoose.model('Projects', ProjectSchema);