import express from "express";
import User from "../models/User.js";
<<<<<<< HEAD
=======
import fetch from 'node-fetch';
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b
const router = express.Router();

// List vendors (minimal fields used on map)
router.get("/", async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" }, "name email address location");
    res.json(
      vendors.map(v => ({
        _id: v._id,
        name: v.name,
        email: v.email,
        address: v.address || null,
        // Return lat/lng if coordinates set as GeoJSON Point [lng, lat]
        latitude: v.location?.coordinates?.[1] ?? null,
        longitude: v.location?.coordinates?.[0] ?? null,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// Set or update vendor geolocation (requires vendor auth in real app)
router.post("/location", async (req, res) => {
  try {
    const { vendorId, latitude, longitude, address } = req.body;
    if (!vendorId) {
      return res.status(400).json({ error: "vendorId is required" });
    }
    const vendor = await User.findOne({ _id: vendorId, role: 'vendor' });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      vendor.location = { type: 'Point', coordinates: [longitude, latitude] };
    } else if (address) {
      try {
        const q = encodeURIComponent(address);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}`;
        const resp = await fetch(url, {
          headers: { 'User-Agent': 'bifix-app/1.0 (contact: admin@example.com)' }
        });
        if (resp.ok) {
          const data = await resp.json();
          if (Array.isArray(data) && data.length > 0) {
            const best = data[0];
            const lat = Number(best.lat);
            const lon = Number(best.lon);
            if (!Number.isNaN(lat) && !Number.isNaN(lon)) {
              vendor.location = { type: 'Point', coordinates: [lon, lat] };
            }
          }
        }
<<<<<<< HEAD
      } catch { }
=======
      } catch {}
>>>>>>> cf08b2757c64ae03755541b2a3ebdf180c17b46b
    }
    await vendor.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

// Nearby vendors by coordinates
router.get("/near", async (req, res) => {
  try {
    const { latitude, longitude, radiusMeters = 5000 } = req.query;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "latitude and longitude are required" });
    }
    const nearby = await User.find({
      role: 'vendor',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
          $maxDistance: Number(radiusMeters)
        }
      }
    }, 'name email address location');
    res.json(nearby.map(v => ({
      _id: v._id,
      name: v.name,
      email: v.email,
      address: v.address || null,
      latitude: v.location?.coordinates?.[1] ?? null,
      longitude: v.location?.coordinates?.[0] ?? null,
    })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch nearby vendors" });
  }
});

export default router;