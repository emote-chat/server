const jwt = require('jsonwebtoken');

module.exports = ({ authorization }) => {
    // remove 'Bearer ' from string if applicable
    const token = authorization.startsWith('Bearer ') ?
        authorization.slice(7, authorization.length) :
        authorization;
    
    // using decode b/c we already have middleware setup 
    // that verifies validity of token
    const payload = jwt.decode(token);

    return payload;
}