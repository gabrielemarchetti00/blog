const mongoose = require("mongoose")
const { DateTime } = require("luxon");

const Schema = mongoose.Schema

const postSchema = new Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
})

postSchema.virtual("url").get(function() {
    return `/post/${this._id}`
})

postSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Post", postSchema)