const { model, Schema } = require('mongoose')
 
let farewell = new Schema({
    GuildID: String,
    Message: String,
    Channel: String,
})
 
module.exports = model('farewell', farewell)