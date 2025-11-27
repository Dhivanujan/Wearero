const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLE_VALUES = ['customer', 'admin'];

const sanitizeRole = (value) => {
  if (!value) return 'customer';
  const normalized = value.toString().trim().toLowerCase();
  return ROLE_VALUES.includes(normalized) ? normalized : 'customer';
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: 'customer',
      set: sanitizeRole,
    },
  },
  { timestamps: true }
);

//Password Hash Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
