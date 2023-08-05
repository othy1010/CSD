import Sequelize from 'sequelize';

// Initialize Sequelize with your database connection
const sequelize = new Sequelize('postgres', 'csd', 'csd', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

// Define your models

// Collaboration model
const Collaboration = sequelize.define('collaboration', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.STRING,
  },
}, {
  underscored: true,
});

// User model
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, {
  underscored: true,
});

// Proposal model
const Proposal = sequelize.define('proposal', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATE,
  },
  status: {
    type: Sequelize.STRING,
  },
}, {
  underscored: true,
});

// Define associations
User.belongsToMany(Collaboration, { through: 'UserCollaboration' });
Collaboration.belongsToMany(User, { through: 'UserCollaboration' });
Collaboration.hasMany(Proposal);
Proposal.belongsTo(Collaboration);

export { sequelize, User, Collaboration, Proposal };
