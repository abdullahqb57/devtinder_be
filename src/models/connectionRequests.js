import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, enum: 
        {   values: ['ignored', 'interested', 'rejected', 'accepted'],
            message: props => `${props.value} is not a valid status!`
        } }
}, { timestamps: true });

connectionRequestSchema.pre('save', async function() {
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
});

export default mongoose.model('ConnectionRequest', connectionRequestSchema);