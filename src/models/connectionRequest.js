const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User", // refernce to the user collection
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: `{VALUE} is incorrect status type`,
        }
    }
},
    { timestamps: true });
//It is combined indexing, since we are searching both together in one of the use cases
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre('save', function (next) {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    // we compare id with equal method since it is not simple string
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
})

const connectionRequestModel = new mongoose.model('connectRequest', connectionRequestSchema)

module.exports = connectionRequestModel;