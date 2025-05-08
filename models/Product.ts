import mongoose, { Schema } from 'mongoose'

// Define the Site Content schema
const productSchema = new Schema(
  {
    title: String,
    description: String,
    images: [
      {
        thumbnail: String,
        file: String,
        fileId: String
      }
    ],
    attributes: [
      {
        key: String,
        value: String
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const Products = mongoose.models.products || mongoose.model('product', productSchema)

export default Products
