const { role } = require("../models");
const { body, validationResult } = require("express-validator");

const createRole = async (req, res) => {
  try {
    const validate = [
      body("name")
        .notEmpty()
        .withMessage("Code is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters long")
        .custom(async (name) => {
          const existingRole = await role.findOne({ where: { name } });
          console.log(name)
          if (existingRole) {
            throw new Error("Name must be unique");
          }
        }),
      body("code")
        .notEmpty()
        .withMessage("Code is required")
        .custom(async (code) => {
          const existingRole = await role.findOne({ where: { code } });
          if (existingRole) {
            throw new Error("Code must be unique");
          }
        }),
    ];

    // Execute validation middleware
    Promise.all(validate.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const newRole = await role.create(req.body);

    return res.status(201).json(newRole);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await role.findAll();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const role = await role.findByPk(roleId);
    if (role) {
      return res.status(200).json(role);
    }
    return res.status(404).send("Role with the specified ID does not exist");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await role.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedRole = await role.findOne({ where: { id: id } });
      return res.status(200).json({ role: updatedRole });
    }
    throw new Error("Role not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await role.destroy({
      where: { id: id },
    });
    if (deleted) {
      return res.status(204).send("Role deleted");
    }
    throw new Error("Role not found");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
