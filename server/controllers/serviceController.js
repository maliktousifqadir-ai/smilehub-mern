const Service = require("../models/Service");

// ==============================
// Add Service
// ==============================
const addService = async (req, res) => {
  try {
    const {
      name,
      price,
      duration,
      description,
    } = req.body;

    // Check if service already exists
    const serviceExists = await Service.findOne({ name });

    if (serviceExists) {
      return res.status(400).json({
        message: "Service already exists",
      });
    }

    // Create service
    const service = await Service.create({
      name,
      price,
      duration,
      description,
    });

    res.status(201).json({
      message: "Service Added Successfully",
      service,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// Get All Services
// ==============================
const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ==============================
// Get Single Service
// ==============================
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json(service);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  addService,
  getServices,
  getServiceById,
};