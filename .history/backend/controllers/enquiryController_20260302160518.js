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
    let { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search = "" } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // Sorting order fix
    const sortOrder = order === "asc" ? 1 : -1;

    // Search filter (client name ya email pe search karenge)
    let searchFilter = {};

    if (search) {
      searchFilter = {
        $or: [
          { message: { $regex: search, $options: "i" } }
        ]
      };
    }

    const enquiries = await Enquiry.find(searchFilter)
      .populate("client")
      .select("name email mobile message enquiryDate")
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

      console.log(enquiries)

    const total = await Enquiry.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: enquiries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};