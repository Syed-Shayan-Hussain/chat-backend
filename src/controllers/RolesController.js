const { Op } = require("sequelize");
const { role } = require("../models");
const { validationResult } = require("express-validator");

const createRole = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingRole = await role.findOne({
      where: {
        [Op.or]: [{ role: req.body.role }, { code: req.body.code }],
      },
    });

    if (existingRole) {
      return res.status(400).json({ error: "Role or Code already exists" });
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
    const roleItem = await role.findByPk(roleId);
    if (roleItem) {
      return res.status(200).json(roleItem);
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
