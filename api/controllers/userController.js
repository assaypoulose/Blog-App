import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import { errorHandler} from '../utils/error.js';
import jwt from 'jsonwebtoken';


export const signup = async(req, res, next) => {
    const { username, email, password} = req.body;

    if(!username || !email || !password || username === '' || email === '' || password === ''){
        next(errorHandler(400, " All fields are required."))
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try{
        await newUser.save();
        res.json({message: "Signup successfull"})
    }catch(error) {
        next(error)
    }

}

export const signin = async(req, res, next) => {
    const { email, password} = req.body;

    if(!email || !password || email === '' || password === ''){
        next(errorHandler(400, "All fields are required"));
    }

    try{
        const validUser = await User.findOne({email});
        if(!validUser) {
            return next(errorHandler(400, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword){
            return next(errorHandler(400, "Invalid password"));
        }
        const token = jwt.sign({id: validUser._id, isAdmin: validUser.isAdmin},process.env.JWT_SECRET,{expiresIn:'1d'})

        const { password: pass, ...rest} = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        })
        .json(rest);
        
    }catch(error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl} = req.body;

    try{
        const user = await User.findOne({email});
        if(user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET);

            const { password, ...rest} = user._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });

            const { password, ...rest } = newUser._doc;

            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            })
                .json(rest);

        }
    } catch (error) {
        next(error);
    }
} 

export const updateUser = async (req, res, next) => {
    //console.log(req.user);
    if(req.user.id != req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }
    if(req.body.password) {
        if(req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if(req.body.username) {
        if(req.body.username.length <7 || req.body.username.length >20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
        if(req.body.username != req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(
                errorHandler(400, 'Username can only contain letters and numbers'));
            }
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            }, {new: true});
            const { password, ...rest} = updatedUser._doc;
            res.status(200).json(rest);
        } catch (error) {
            next(error);
        }
};

export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id != req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json({message: "User deleted successfully"});
    }catch (error) {
            next(error);
        }
}

export const signout = (req, res, next ) => {
    try{
        res.clearCookie('access_token').status(200).json('User has been signed out');
    }catch(error) {
        next(error);
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        });
    } catch (error) {
        next(error);
    }
};