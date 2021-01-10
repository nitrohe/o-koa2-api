import Sequelize from 'sequelize'
export default {
  project: {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false
    },
    title: {
      type: Sequelize.STRING(90),
      allowNull: true
      // validate: {
      //   is: ['^[a-z]+$', 'i'],
      //   not: ['[a-z]', 'i'],
      //   isEmail: true
      // }
      // field: 'project_title'
    }
  }
}
