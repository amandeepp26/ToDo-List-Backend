const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  mobile: {
    type: Number,
  },
},
{
    timestamps : true
});

const User = mongoose.model('User',userSchema);

module.exports = User;
