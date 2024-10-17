const { model, Schema } = require(`mongoose`)

let report = new Schema({
    Guild: String,
    Channel: String,
})

module.exports = model("report", report)