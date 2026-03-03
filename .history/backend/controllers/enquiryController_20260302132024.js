const client = require("../models/client");
const { default: Enquiry } = require("../models/enquiry");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    const findExistingClient = await client.find({$and: [{email: email}, {mobile: phone}]});

    let newClint;

    if(!findExistingClient){

        newClint = await client.create({
            name,
            email,
            mobile
        })
    }

    const enquiry = await Enquiry.create({
      client: newClint._id || findExistingClient._id, 
      message,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      data: enquiry,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};