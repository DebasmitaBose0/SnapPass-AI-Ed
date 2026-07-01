import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    commentHi: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    clientFingerprint: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    submitterIp: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "approved",
      index: true,
    },
    isSeed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ submitterIp: 1, createdAt: -1 });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
