const mongoose = require("mongoose");

const toDoSchema = mongoose.Schema({
    title: {
        type :String,
        required:[true,'Title is required']
    },
    description:{
        type:String,
        required :[true, 'Description is required']
    }
})

const data = mongoose.model('Data',toDoSchema)

module.exports = data;