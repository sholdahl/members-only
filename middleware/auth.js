module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'You must be logged in to view that page');
        res.status(401).redirect('/log-in');
    }
}

module.exports.isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.membershipStatus === "member") {
        next();
        console.log("MEMBER")
    } else {
        console.log("NOT A MEMBER")
        req.flash('error', 'You must be a member to view that page');
        res.status(401).redirect('/user/member-application');
    }
}

