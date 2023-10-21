import Sequelize from "sequelize";

// Initialize Sequelize with your database connection
const sequelize = new Sequelize("neondb", "othy1010", "j0hn3IUiXqAY", {
  host: "ep-fragrant-base-78211248.us-east-2.aws.neon.tech",
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // You might want to set this to true in production
    },
  },
});

// Collaboration model
const Collaboration = sequelize.define(
  "Collaboration",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      description: Sequelize.INTEGER,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    startDate: Sequelize.STRING,
    decisionDuration: Sequelize.STRING,
    evaluationDuration: Sequelize.STRING,
    status: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

// User model
const User = sequelize.define(
  "user",
  {
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
    expertise: Sequelize.STRING,
    userRole: {
      type: Sequelize.ENUM(
        "DEVELOPER",
        "ARCHITECT",
        "SECURITYEXPERT",
        "MANAGER"
      ),
    },
    isModerator: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    underscored: true,
  }
);

// Proposal model
const Proposal = sequelize.define(
  "proposal",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: Sequelize.STRING,
    date: Sequelize.STRING,
    status: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

// DecisionPattern model
const DecisionPattern = sequelize.define(
  "decision_pattern",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);
// ParticipationMethod model
const ParticipationMethod = sequelize.define(
  "participation_method",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.ENUM("INDIVIDUAL", "GROUP", "COLLABORATIVE"),
    },
  },
  {
    underscored: true,
  }
);

// CodecisionMethod model
const CodecisionMethod = sequelize.define(
  "codecision_method",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    processKind: {
      type: Sequelize.ENUM("LINEAR", "CYCLIC", "ITERATIVE"),
    },
    evaluationKind: {
      type: Sequelize.ENUM("QUANTITATIVE", "QUALITATIVE"),
    },
    agreementThreshold: {
      type: Sequelize.ENUM("MAJORITY", "UNANIMITY", "CONSENSUS"),
    },
  },
  {
    underscored: true,
  }
);

// Intent, Solution, Application, Knowuse have very similar definitions
// You can make a utility function to generate such models but for now, I'll just define them:

const Intent = sequelize.define(
  "intent",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

const Solution = sequelize.define(
  "solution",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

const Application = sequelize.define(
  "application",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

const Knowuse = sequelize.define(
  "knowuse",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

// Threat model
const Threat = sequelize.define(
  "threat",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    reference: {
      type: Sequelize.ENUM("ATTACK", "CAPEC"),
    },
    refid: Sequelize.STRING,
    impactseverity: {
      type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
    },
    date: Sequelize.DATE,
  },
  {
    underscored: true,
  }
);

// Risk model
const Risk = sequelize.define(
  "risk",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    reference: {
      type: Sequelize.ENUM("NIST", "OWASP"),
    },
    refid: Sequelize.STRING,
    impactseverity: {
      type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
    },
  },
  {
    underscored: true,
  }
);

// Mitigation model
const Mitigation = sequelize.define(
  "mitigation",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    reference: {
      type: Sequelize.ENUM("NIST", "OWASP", "ATTACK", "CAPEC", "CVE", "CWE"),
    },
    refid: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

// Decision model
const Decision = sequelize.define(
  "decision",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    agreements: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    comment: Sequelize.STRING,
    date: Sequelize.DATE,
  },
  {
    underscored: true,
  }
);

// Change model
const Change = sequelize.define(
  "change",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    changetype: {
      type: Sequelize.ENUM("ADD", "EDIT", "DELETE"),
      allowNull: false,
    },
    comment: Sequelize.STRING,
  },
  {
    underscored: true,
  }
);

// Vulnerability model
const Vulnerability = sequelize.define(
  "vulnerability",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    reference: {
      type: Sequelize.ENUM("CVE", "CWE", "CAPEC", "NIST", "OWASP"),
    },
    refid: Sequelize.STRING,
    date: Sequelize.DATE,
  },
  {
    underscored: true,
  }
);
User.belongsToMany(Collaboration, { through: "UserCollaboration" });
Collaboration.belongsToMany(User, { through: "UserCollaboration" });
Collaboration.hasMany(Proposal);
Proposal.belongsTo(Collaboration);
Collaboration.belongsTo(DecisionPattern);
DecisionPattern.hasOne(Collaboration);
Proposal.hasMany(Decision);
Decision.belongsTo(Proposal);
Proposal.hasMany(Change);
Change.belongsTo(Proposal);
User.hasMany(Decision);
Decision.belongsTo(User);
User.hasMany(Proposal);
Proposal.belongsTo(User);
User.hasMany(Proposal, { foreignKey: "authorId" });
Proposal.belongsTo(User, { as: "author", foreignKey: "authorId" });

export {
  sequelize,
  Collaboration,
  User,
  Proposal,
  DecisionPattern,
  ParticipationMethod,
  CodecisionMethod,
  Intent,
  Solution,
  Application,
  Knowuse,
  Threat,
  Risk,
  Mitigation,
  Decision,
  Change,
  Vulnerability,
};
