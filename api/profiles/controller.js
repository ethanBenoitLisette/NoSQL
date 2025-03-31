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

exports.addExperience = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        profile.experience.push(req.body);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeExperience = async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        profile.experience = profile.experience.filter(exp => exp._id.toString() !== req.params.exp);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

exports.removeSkill = async (req, res) => {
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