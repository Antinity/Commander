const { model, Schema } = require('mongoose');
 
let counting = new Schema ({
    Guild: String,
    Channel: String,
    Count: Number,
    Reset: Boolean
})
 
module.exports = model('counting', counting);