import {Sequelize} from 'sequelize-typescript'

const sequelize = new Sequelize('postgres', 'postgres', 'kissa123', {
    host: 'localhost',
    dialect: 'postgres'
  });
  
  export default sequelize;
