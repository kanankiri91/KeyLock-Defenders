import { Sequelize } from "sequelize";
import dbConnect from "../config/database.js";
import Users from '../model/UserModel.js';

const { DataTypes } = Sequelize;

const DataAkun = dbConnect.define('data_akun', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    objek_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'objek_pengecekan',
            key: 'id'
        }
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    akun_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'akun',
            key: 'id'
        }
    },
    create_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    kurun_waktu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'waktu_pengecekan',
            key: 'id'
        }
    }
}, {
    tableName: 'data_akun',
    freezeTableName: true,
    timestamps: false,
    paranoid: true,
    underscored: true
});

const WaktuPengecekan = dbConnect.define('waktu_pengecekan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'waktu_pengecekan',
    timestamps: false,
});

const ObjekPengecekan = dbConnect.define('objek_pengecekan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'objek_pengecekan',
    timestamps: false,
});

const Result = dbConnect.define('result', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    data_akun_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'data_akun',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
    hasil: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
    next_pengecekan: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'result',
    timestamps: false,
  });

const InformasiWeb = dbConnect.define('informasi_web', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data_akun_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'data_akun',
            key: 'id'
        }
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
    keterangan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, {
    tableName: 'informasi_web',
    timestamps: false,
});

const OTP = dbConnect.define('otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'otp',
    freezeTableName: true,
    timestamps: false
});

Users.hasMany(OTP, { foreignKey: 'user_id' });
OTP.belongsTo(Users, { foreignKey: 'user_id' });

DataAkun.belongsTo(WaktuPengecekan, { foreignKey: 'kurun_waktu_id' });
WaktuPengecekan.hasMany(DataAkun, { foreignKey: 'kurun_waktu_id' });

Result.belongsTo(DataAkun, { foreignKey: 'data_akun_id' });
DataAkun.hasMany(Result, { foreignKey: 'data_akun_id' });

InformasiWeb.belongsTo(DataAkun, { foreignKey: 'data_akun_id' });
DataAkun.hasMany(InformasiWeb, { foreignKey: 'data_akun_id' });

DataAkun.belongsTo(Users, { foreignKey: 'akun_id' });
Users.hasMany(DataAkun, { foreignKey: 'akun_id' });

export { DataAkun, WaktuPengecekan, ObjekPengecekan, Result, InformasiWeb, OTP };
