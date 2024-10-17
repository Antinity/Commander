const { model, Schema } = require('mongoose')
 
let welcomer = new Schema({
    GuildID: String,
    Message: String,
    Channel: String,
})
 
module.exports = model('welcomer', welcomer)