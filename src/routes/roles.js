const express = require('express');
const router = express.Router();

const { createRole, getRoles, getRole, updateRole, deleteRole } = require('../controllers/rolesController');
const { validateRole } = require('../middlewares/validators/RoleValidator');

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', validateRole, createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;