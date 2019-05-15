module.exports = (err, req, res, next) => {
    // custom error; 400
    if(typeof(err) === 'string') {
        return res.status(400).json({ 
            message: err 
        });
    }
    
    // jwt auth err; 401
    if(err.name === 'UnauthorizedError') {
        return res.status(401).json({ 
            message: 'Invalid/missing token' 
        });
    }

    // membership err; 401
    if (err.name === 'MembershipError') {
        return res.status(401).json({ 
            message: 'Not a member of this chat' 
        });
    }

    if (err.name === 'ChatOrMessageNotFound') {
        return res.status(404).json({
            message: 'Given chat or message not found'
        });
    }   

    // server error; 500 
    return res.status(500).send({ 
        message: err.message 
    });
};
