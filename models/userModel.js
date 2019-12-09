const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name, email, photo, password, passwordConfirm

// TOUR SCHEMA (MODEL)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    maxlength: [50, 'A user name must have less or equal than 50 characters'],
    minlength: [5, 'A user name must have greater than 5 characters']
    //validate: [validator.isAlpha, 'The tour name must only contain letters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail]
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
    minlength: [8, 'A password must have at least 8 characters'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Provide a password confirmation'],
    validate: {
      // this only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    },
    select: false
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now()
  }
});

// model is the best place for password encryption ?!
// so, use the pre middleware
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash password or encrypt it by bcrypt with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // not to save in db
  this.passwordConfirm = undefined;
});

// instance method for password checking
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
