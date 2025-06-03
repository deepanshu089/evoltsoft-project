import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  powerOutput: {
    type: Number,
    required: true
  },
  connectorType: {
    type: String,
    enum: ['CCS', 'CHAdeMO', 'Type 2', 'Type 1'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
stationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Station = mongoose.model('Station', stationSchema);

export default Station;