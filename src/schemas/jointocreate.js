const { model, Schema } = require(`mongoose`)

let joinToCreate = new Schema({
    Guild: String,
    Channel: String,
    Category: String,
})

module.exports = model("joinToCreate", joinToCreate)