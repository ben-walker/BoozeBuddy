export default {
    email: {
        presence: { allowEmpty: false },
        email: { message: '^That email doesn\'t look right' },
    },
    username: {
        presence: { allowEmpty: false },
        length: { minimum: 4, maximum: 20 },
    },
    password: {
        presence: { allowEmpty: false },
        length: { minimum: 8, },
    },
    weightKg: {
        presence: { allowEmpty: false },
        numericality: { message: '^Weight must be a number' },
    },
};
