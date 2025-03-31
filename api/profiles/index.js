const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/', controller.getProfiles);
router.get('/:id', controller.getProfileById);
router.post('/', controller.createProfile);
router.put('/:id', controller.updateProfile);
router.delete('/:id', controller.deleteProfile);

router.post('/:id/experience', controller.addExperience);
router.delete('/:id/experience/:exp', controller.removeExperience);

router.post('/:id/skills', controller.addSkill);
router.delete('/:id/skills/:skill', controller.removeSkill);

module.exports = router;