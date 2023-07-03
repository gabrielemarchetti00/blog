const mongoose = require("mongoose")

const Schema = mongoose.Schema

const commentSchema = new Schema({
    text: {type: String, required: true},
    timestamp: {type: Date, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    post: {type: Schema.Types.ObjectId, ref: "Post", required: true}
})

commentSchema.virtual("url").get(function() {
    return `/comment/${this._id}`
})

module.exports = mongoose.model("Comment", commentSchema)