const client = require("../models/client");
const { default: Enquiry } = require("../models/enquiry");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    console.log(req.body)

    
    let existingClient = await client.findOne({
      email: email,
      mobile: mobile
    });

    let clientData;

    
    if (!existingClient) {
      clientData = await client.create({
        name,
        email,
        mobile: mobile
      });
    } else {
      clientData = existingClient;
    }

    const enquiry = await Enquiry.create({
      client: clientData._id,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("client");  // reference populate

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};