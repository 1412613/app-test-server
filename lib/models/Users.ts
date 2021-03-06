import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('Users', UserSchema);