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




export const getEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sortBy = "enquiryDate",
      order = "desc",
      search = "",
    } = req.query;

    const skip = (page - 1) * limit;

    const sortOrder = order === "asc" ? 1 : -1;

    let sortObj = {};

    // ⚠️ IMPORTANT PART
    if (sortBy === "name") {
      sortObj["client.name"] = sortOrder;
    } else if (sortBy === "email") {
      sortObj["client.email"] = sortOrder;
    } else if (sortBy === "mobile") {
      sortObj["client.mobile"] = sortOrder;
    } else {
      sortObj[sortBy] = sortOrder;
    }

    const enquiries = await Enquiry.find()
      .populate("client")
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments();

    res.json({
      data: enquiries,
      pagination: {
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
  }
};