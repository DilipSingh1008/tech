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




exports.getEnquiries = async (req, res) => {
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

    let sortStage = {};

    if (sortBy === "name") {
      sortStage["client.name"] = sortOrder;
    } else if (sortBy === "email") {
      sortStage["client.email"] = sortOrder;
    } else if (sortBy === "mobile") {
      sortStage["client.mobile"] = sortOrder;
    } else {
      sortStage[sortBy] = sortOrder;
    }

    const enquiries = await Enquiry.aggregate([
      {
        $lookup: {
          from: "clients", // ⚠️ collection name check karo
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: Number(limit) },
    ]);

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


export const searchClientByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) return res.json([]);

    const clients = await Client.find({
      mobile: { $regex: `^${mobile}` }, // starts with search
    }).limit(5);

    res.json(clients);
  } catch (error) {
    console.error(error);
  }
};