import mongoose, { Schema } from 'mongoose'

// Define the User schema
const userSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   required: [true, 'Name is required'],
    //   trim: true,
    //   minLength: [2, 'Name must be at least 2 characters long']
    // },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be at least 8 characters long']
    }
  },
  {
    timestamps: true,
    // This ensures virtuals are included when converting document to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
