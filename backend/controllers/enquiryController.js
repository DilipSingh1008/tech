const client = require("../models/client");
const { default: Enquiry } = require("../models/enquiry");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    console.log(req.body);

    let existingClient = await client.findOne({
      email: email,
      mobile: mobile,
    });

    let clientData;

    if (!existingClient) {
      clientData = await client.create({
        name,
        email,
        mobile: mobile,
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
      fromDate,
      toDate,
    } = req.query;

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    // Sort stage
    let sortStage = {};
    if (sortBy === "name") sortStage["client.name"] = sortOrder;
    else if (sortBy === "email") sortStage["client.email"] = sortOrder;
    else if (sortBy === "mobile") sortStage["client.mobile"] = sortOrder;
    else sortStage[sortBy] = sortOrder;

    // Search + soft delete + date filter
    let matchStage = { isDeleted: { $ne: true } }; // exclude soft-deleted records

    if (search) {
      matchStage.$or = [
        { "client.name": { $regex: search, $options: "i" } },
        { "client.email": { $regex: search, $options: "i" } },
        { "client.mobile": { $regex: search, $options: "i" } },
        { service_id: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
      ];
    }

    // Date filter
    if (fromDate || toDate) {
      matchStage.enquiryDate = {};
      if (fromDate) matchStage.enquiryDate.$gte = new Date(fromDate);
      if (toDate) matchStage.enquiryDate.$lte = new Date(toDate);
    }

    // Aggregate pipeline
    const pipeline = [
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      { $match: matchStage },
      { $sort: sortStage },
      { $skip: Number(skip) },
      { $limit: Number(limit) },
    ];

    const enquiries = await Enquiry.aggregate(pipeline);

    // Total count for pagination (after filtering)
    const countPipeline = [
      {
        $lookup: {
          from: "clients",
          localField: "client",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      { $match: matchStage },
      { $count: "total" },
    ];

    const totalResult = await Enquiry.aggregate(countPipeline);
    const totalCount = totalResult[0]?.total || 0;

    res.json({
      data: enquiries,
      pagination: {
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        totalEntries: totalCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.searchClientByMobile = async (req, res) => {
  try {
    const { mobile } = req.query;

    if (!mobile) return res.json([]);

    const clients = await client
      .find({
        mobile: { $regex: `^${mobile}` }, // starts with search
      })
      .limit(5);

    res.json(clients);
  } catch (error) {
    console.error(error);
  }
};
