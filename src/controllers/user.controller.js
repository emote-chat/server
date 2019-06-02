const path = require('path');

const db = require(path.join(__dirname, '../db/index'));
const queries = require(path.join(__dirname, '../db/queries'));

exports.getUserByEmail = async (req, res, next) => {
    try {
        const email = req.params.email.toLowerCase();
        const resp = await db.any(queries.findUserByEmail, [email]);
        if (!resp.length) return res.status(404).send({ message: 'User not found' });

        const { password, ...user } = resp[0];
        return res.status(200).json(user);
    }
    catch (error) {
        if (error) return next(error);
    }
}