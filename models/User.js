const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomize = require("randomatic");
var gravatar = require("gravatar");

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please add a first_name"],
  },
  last_name: {
    type: String,
    required: [true, "Please add a last_name"],
  },

  avatar: {
    type: String,
  },
  followers: [{ type: mongoose.ObjectId, ref: "User" }],
  following: [{ type: mongoose.ObjectId, ref: "User" }],

  phone: {
    type: String,
    validate: {
      validator: function (v) {
        // Phone number format validation
        return /^\+?\d{1,3}[- ]?\d{3}[- ]?\d{3}[- ]?\d{4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        // Email format validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address`,
    },
  },

  // email: {
  //   type: String,
  //   required: [true, "Please add an email"],
  //   unique: true,
  //   match: [
  //     /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  //     "Please add a valid email",
  //   ],
  // },
  bio: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length >= 10;
      },
      message: (props) => `Bio must not exceed 10 characters`,
    },
  },
  country: {
    type: String,
    required: [true, "Please add a country"],
    default: "Nigeria",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function (v) {
        // Password validation
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid password. A valid password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number`,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  confirmEmailToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  twoFactorEnable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.path("followers").validate(function (followers) {
  const userId = this._id;
  return new Promise((resolve, reject) => {
    if (followers.length === 0) {
      return resolve(true); // Allow empty followers array
    }

    // Check if all followers are valid user IDs
    User.find(
      {
        _id: {
          $in: followers,
        },
      },
      function (err, users) {
        if (err) {
          return reject(err);
        }

        const isValid = users.every(
          (user) => user._id.toString() !== userId.toString()
        );

        if (!isValid) {
          return reject(
            new Error("One or more invalid user IDs in followers array")
          );
        }

        return resolve(true);
      }
    );
  });
});

UserSchema.pre("save", function (next) {
  if (!this.avatar) {
    const avatarUrl = gravatar.url(
      this.email,
      { s: "200", r: "pg", d: "mp" },
      true
    );
    this.avatar = avatarUrl;
  }
  next();
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Encrypt password using bcrypt while updating (admin)
UserSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    this._update.password = await bcrypt.hash(this._update.password, 10);
  }
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email confirm token
UserSchema.methods.generateEmailConfirmToken = function (next) {
  // email confirmation token
  const confirmationToken = crypto.randomBytes(20).toString("hex");

  this.confirmEmailToken = crypto
    .createHash("sha256")
    .update(confirmationToken)
    .digest("hex");

  const confirmTokenExtend = crypto.randomBytes(100).toString("hex");
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
  return confirmTokenCombined;
};

module.exports = mongoose.model("User", UserSchema);
