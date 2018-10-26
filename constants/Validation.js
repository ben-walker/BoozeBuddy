export default {
    email: {
        length: {
            minimum: 1,
            message: '^An email address is required',
        },
        email: { message: '^That email doesn\'t look right' },
    },
    username: {
        length: {
            minimum: 4,
            maximum: 20,
        },
    },
    password: {
        length: {
            minimum: 8,
        },
    },
};
