import mongoose, { Schema } from 'mongoose'

// Define the Site Content schema
const homePageSchema = new Schema(
  {},
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const HomePage = mongoose.models.homepage || mongoose.model('homepage', homePageSchema)

export default HomePage
