import '../async_validators';

export default {
    email: {
        presence: { allowEmpty: false },
        email: { message: '^That email doesn\'t look right' },
        emailTaken: true,
    },
    username: {
        presence: { allowEmpty: false },
        length: { minimum: 4, maximum: 20 },
        usernameTaken: true,
    },
    password: {
        presence: { allowEmpty: false },
        length: { minimum: 8, },
    },
    weightKg: {
        presence: { allowEmpty: false },
        numericality: { message: '^Weight must be a number' },
    },
    gender: {
        presence: { allowEmpty: false },
    },
    identifier: {
        presence: { allowEmpty: false },
    },
    loginPassword: {
        presence: { allowEmpty: false, message: '^Password can\'t be blank' },
    },
//-----------------------------------------------------------------------------------
    drinkName: {
        presence: { allowEmpty: false },
        length: { minimum: 2, maximum: 30 },
    },
    drinkVolume: {
        presence: { allowEmpty: false },
        numericality: { message: 'must be a number' },
    },
    drinkAlcoholContent: {
        presence: { allowEmpty: false },
        numericality: { message: 'must be a percentage between 0 and 100.', greaterThanOrEqualTo: 0, lessThanOrEqualTo: 100 },
    },
};
