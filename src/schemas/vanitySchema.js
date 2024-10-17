const { model, Schema } = require('mongoose')
 
let vanitySchema = new Schema({
    GuildID: String,
    Role: String,
    Text: String,
})
 
module.exports = model('vanitySchema', vanitySchema)