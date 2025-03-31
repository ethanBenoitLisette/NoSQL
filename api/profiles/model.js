const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: [
        {
            title: String,
            company: String,
            dates: String,
            description: String,
        },
    ],
    skills: [String],
    information: {
        bio: String,
        location: String,
        website: String,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
});

module.exports = mongoose.model('Profile', ProfileSchema);