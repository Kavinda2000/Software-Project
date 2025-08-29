import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    testType: {
        type: String,
        enum: ["Bike Repair", "Bike Service"],
        required: true,
    },
    // Replace address string with coordinates
    location: {
        type: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        },
        required: true
    },
    formattedAddress: {
        type: String, // optional, Google Maps can return this
        required: false
    },
    price: {
        type: Number,
        required: false,
    },
    owner: {
        type: String,
        required: true,
    },
    timeSlots: [
        {
            date: { type: Date, required: true },
            slot: { type: String, required: true },
            booked: { type: Boolean, default: false },
        }
    ]
}, {
    timestamps: true
});

// Optional: prevent duplicate test names by same owner
testSchema.index({ name: 1, owner: 1 }, { unique: true });

const Test = mongoose.model("Test", testSchema);

export default Test;
