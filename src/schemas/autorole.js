const { model, Schema } = require('mongoose')
 
let autoRole = new Schema({
    GuildID: String,
    Role: String,
})
 
module.exports = model('AutoRole', autoRole)