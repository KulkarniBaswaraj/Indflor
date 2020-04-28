const mongoose = require("mongoose");
const validator = require('validator')
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const {sendAccDeactEmail} = require("../emails/account");

const userSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    validate(value) {
      if (value.includes('name')) {
        throw new Error('invalid name');
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    validate(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    trim: true,
    validate(value) {
      if(value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain password');
      }
    }
  },
  dob: {
    type: Date,
    required: false,
  },
  phone: {
    type: String,
    required: false
  },
  city: {
    type: String,
    required: false
  },
  pin: {
    type: String,
    required: false
  },
  resetPassToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: String,
    required: false
  },
  tokens: [
    {
      token: {
        type: String
      }
    }
  ]
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.methods.toJSON = function() {
  const user = this
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.resetPassToken;
  delete userObject.resetPasswordExpires;

  return userObject;
}

userSchema.methods.generateAuthToken = async function() {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

userSchema.methods.genResetPassToken = async function() {
  const user = this
  user.resetPassToken =  crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
}

userSchema.methods.resetPassword = async function(password) {
  const user = this
  user.resetPassToken = undefined;
  user.resetPasswordExpires = undefined;
  user.password = password;
  await user.save();
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email});
  if(!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    throw new Error('unable to login');
  }
  return user;
}

userSchema.pre('save', async function (next) {
  const user = this
  if(user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre('remove', async function(next) {
  const user = this
  await Task.deleteMany({owner: user._id});
  sendAccDeactEmail(user.email, user.name);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;