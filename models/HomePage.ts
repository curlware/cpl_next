import mongoose, { Schema } from 'mongoose'

// Define the Site Content schema
const homePageSchema = new Schema(
  {
    sliders: [
      {
        title: String,
        subtitle: String,
        images: [
          {
            thumbnail: String,
            file: String,
            fileId: String
          }
        ],
        background: {
          thumbnail: String,
          file: String,
          fileId: String
        }
      }
    ],
    about: {
      title: String,
      description: String
    },
    products: {
      title: String,
      description: String,
      products: [
        {
          type: Schema.Types.ObjectId,
          ref: 'product'
        }
      ]
    },
    stats: {
      title: String,
      image: {
        thumbnail: String,
        file: String,
        fileId: String
      },
      stats: [
        {
          title: String,
          value: String
        }
      ]
    },
    testimonials: [
      {
        name: String,
        designation: String,
        comment: String
      }
    ],
    video: {
      thumbnail: {
        thumbnail: String,
        file: String,
        fileId: String
      },
      link: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const HomePage = mongoose.models.homepage || mongoose.model('homepage', homePageSchema)

export default HomePage
