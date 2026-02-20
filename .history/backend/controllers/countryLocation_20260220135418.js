const Country = require("../models/location.js")


exports.createCountryLocation = async(req, res) => {

    try {

        const {country} = req.body;

        if(!country){
            return res.status(400).json({message: "Country is required"});

        }

        const newCountry = await Country.c({name: country})

        res.status(201).json({message: "Country created successfully", country: newCountry});
        
    } catch (error) {
        console.log(error);

        res.status(500).json({message: "Server Error"});
        
    }
}

