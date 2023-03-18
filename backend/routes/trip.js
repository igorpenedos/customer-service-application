const verifyJWT = require("../middleware/verifyJWT");
const distanceCalculator = require("../libs/distanceCalculator");

const Trip = require("../models/trip");
const Truck = require("../models/truck");
const User = require("../models/user");

const { tripPayload } = require("../schemas/trip");

module.exports = function (app, mongoose) {
  app.post("/trip", verifyJWT, async (req, res) => {
    const user = req.user;
    const body = req.body;
    const { error, value } = tripPayload.validate(body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { sourceCode, location, destination } = value;

    try {
      //get user info for address
      const userInfo = await User.findById(user.id);

      const tripDestination = `${userInfo.address}, ${userInfo.city}, ${userInfo.province} ${userInfo.postalCode}, ${userInfo.country}`;

      //find a truck available
      const availableTruck = await Truck.findOne().sort({
        availabilityCode: 1,
      });

      await Truck.findByIdAndUpdate(availableTruck._id, {
        availabilityCode: availableTruck.availabilityCode + 1,
      });

      let distance = distanceCalculator(
        location.lng,
        location.lat,
        destination.lng,
        destination.lat
      );

      distance = Number(distance.toFixed(2));

      let price = distance * 0.01;

      price = Number(price.toFixed(2));

      const trip = await Trip.create({
        truckId: new mongoose.Types.ObjectId(availableTruck._id),
        sourceCode: sourceCode,
        destination: tripDestination,
        distance: distance,
        price: price,
      });

      return res.status(200).json({ data: trip._id });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });

  app.get("/trip", verifyJWT, async (req, res) => {});
};
