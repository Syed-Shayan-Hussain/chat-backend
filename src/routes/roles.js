const express = require('express');
const router = express.Router();

const { createRole, getRoles, getRole, updateRole, deleteRole } = require('../controllers/rolesController');

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;