// server.js
const express = require('express');
const mongoose = require('./mongodb');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// mongodb.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
connectDB();

module.exports = mongoose;

// api/profiles/model.js
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    experience: [{
        _id: false,
        id: mongoose.Schema.Types.ObjectId,
        title: String,
        company: String,
        dates: String,
        description: String,
    }],
    skills: [String],
    information: {
        bio: String,
        location: String,
        website: String,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }]
});

module.exports = mongoose.model('Profile', ProfileSchema);

// api/profiles/controller.js
const Profile = require('./model');

exports.getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('friends', 'name email');
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProfileById = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id).populate('friends', 'name email');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const newProfile = new Profile({ name, email });
        await newProfile.save();
        res.status(201).json(newProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const updatedProfile = await Profile.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!updatedProfile) return res.status(404).json({ message: 'Profile not found' });
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
        if (!deletedProfile) return res.status(404).json({ message: 'Profile not found' });
        res.json({ message: 'Profile deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gestion des compétences
exports.addSkill = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        profile.skills.push(req.body.skill);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSkill = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        profile.skills = profile.skills.filter(skill => skill !== req.params.skill);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Gestion des amis
exports.addFriend = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        const friend = await Profile.findById(req.body.friendId);
        if (!profile || !friend) return res.status(404).json({ message: 'Profile or Friend not found' });
        profile.friends.push(friend._id);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeFriend = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        profile.friends = profile.friends.filter(friend => friend.toString() !== req.params.friendId);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// routes.js
const express = require('express');
const profileRoutes = require('./api/profiles');

const router = express.Router();
router.use('/profiles', profileRoutes);

module.exports = router;