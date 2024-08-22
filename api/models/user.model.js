import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
    return sequelize.define('user', {
        first_name: { type: DataTypes.STRING },
        last_name: { type: DataTypes.STRING },
        email: { type: DataTypes.STRING }
    }, {
        timestamps: false
    });
}

export {
    UserModel
};
