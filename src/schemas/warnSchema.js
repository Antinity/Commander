const { model, Schema } = require('mongoose')
 
let warnSchema = new Schema({
    GuildID: String,
    UserID: String,
    Reason: Array,
    Date: String,
    Moderator: String
})
 
module.exports = model('warnSchema', warnSchema)