import express from 'express';
import Station from '../models/Station.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET api/stations
// @desc    Get all charging stations
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Support filtering
    const filter = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.connectorType) {
      filter.connectorType = req.query.connectorType;
    }
    
    if (req.query.minPower) {
      filter.powerOutput = { $gte: Number(req.query.minPower) };
    }
    
    const stations = await Station.find(filter).sort({ createdAt: -1 });
    res.json(stations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/stations/:id
// @desc    Get charging station by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }
    
    res.json(station);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Station not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/stations
// @desc    Create a new charging station
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, location, address, status, powerOutput, connectorType } = req.body;

    const newStation = new Station({
      name,
      location,
      address,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user.id
    });

    const station = await newStation.save();
    res.status(201).json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT api/stations/:id
// @desc    Update a charging station
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, location, address, status, powerOutput, connectorType } = req.body;

    // Build station object
    const stationFields = {};
    if (name) stationFields.name = name;
    if (location) stationFields.location = location;
    if (address) stationFields.address = address;
    if (status) stationFields.status = status;
    if (powerOutput) stationFields.powerOutput = powerOutput;
    if (connectorType) stationFields.connectorType = connectorType;
    stationFields.updatedAt = Date.now();

    // Find and update the station
    let station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    station = await Station.findByIdAndUpdate(
      req.params.id,
      { $set: stationFields },
      { new: true }
    );

    res.json(station);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE api/stations/:id
// @desc    Delete a charging station
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Delete request received for station ID:', req.params.id)
    console.log('User from auth:', req.user)

    const station = await Station.findById(req.params.id);
    console.log('Found station:', station)

    if (!station) {
      console.log('Station not found')
      return res.status(404).json({ message: 'Station not found' });
    }

    const deletedStation = await Station.findByIdAndDelete(req.params.id);
    console.log('Deleted station:', deletedStation)

    res.json({ message: 'Station removed' });
  } catch (error) {
    console.error('Delete station error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      name: error.name
    });
  }
});

export default router;