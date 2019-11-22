const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const FestSchema= new Schema({
    text: String,
    // place: String,
    start_date: Date,
    end_date:Date,
    id: String,
    mode: String
    // genre: String,
    // openAir: Boolean
})


module.exports= mongoose.model('Fest', FestSchema)