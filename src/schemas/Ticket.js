const {model, Schema} = require('mongoose');

let TicketSchema = new Schema({
    GuildID: String,
    OwnerID: String,
    MembersID: [String],
    TicketID: String,
    ChannelID: String,
});

module.exports = model('Ticket', TicketSchema); 