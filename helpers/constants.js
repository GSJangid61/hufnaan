module.exports = {
    // Bcrypt Sal round
    SALT_ROUNDS: 10,

    // Scrypt constants
    ALGORITHM: 'aes-256-ctr',
    IV_LENGTH: 16,
    KEYLEN: 32,
    MEM_COST: 14,
    ROUNDS: 8,

    //Forgot Password
    SUBJECT : 'Forgot password',
    FROM_MAIL : 'no-reply@app.zabbit.io',
    PERPAGE:15
}