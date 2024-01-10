import { Model, Optional } from 'sequelize';
import sequelize from "../utils/database"

const Exams = sequelize.define('exams', {
    exam_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    exam_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    published_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'exams',
    timestamps: false,
  });