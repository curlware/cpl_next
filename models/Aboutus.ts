import mongoose, { Schema } from 'mongoose'

// Define the Site Content schema
const aboutusSchema = new Schema(
  {
    title: String,
    background: {
      thumbnail: String,
      file: String,
      fileId: String
    },
    banner: {
      thumbnail: String,
      file: String,
      fileId: String
    },
    items: [
      {
        title: String,
        description: String,
        hash: String,
        image: {
          thumbnail: String,
          file: String,
          fileId: String
        }
      }
    ],
    team: {
      title: String,
      description: String,
      members: [
        {
          name: String,
          designation: String,
          description: String
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
const Aboutus = mongoose.models.aboutus || mongoose.model('aboutus', aboutusSchema)

export default Aboutus
