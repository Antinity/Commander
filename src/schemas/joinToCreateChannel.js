const { model, Schema } = require(`mongoose`)

let joinToCreateChannel = new Schema({
    Guild: String,
    Channel: String,
    User: String,
})

module.exports = model("joinToCreateChannel", joinToCreateChannel)