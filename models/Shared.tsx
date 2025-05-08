import mongoose, { Schema } from 'mongoose'

const sharedSchema = new Schema(
  {
    favicon: {
      thumbnail: String,
      file: String,
      fileId: String
    },
    title: String,
    description: String,
    keywords: String,
    ctatext: String,
    ctalink: String,
    footer: {
      copywrite: String,
      contactoffice: [{ key: String, value: String }],
      contactfactory: [{ key: String, value: String }],
      sociallinks: [
        {
          icon: String,
          link: String
        }
      ]
    },
    nav: {
      logo: {
        thumbnail: String,
        file: String,
        fileId: String
      },
      items: [
        {
          title: String,
          link: String,
          children: [
            {
              title: String,
              link: String
            }
          ]
        }
      ]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Create the model
const SharedData = mongoose.models.shared_data || mongoose.model('shared_data', sharedSchema)

export default SharedData
