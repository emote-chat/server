module.exports = async function () {
    await global.__SERVER__.close();
    await global.__DB__.$pool.end();
};