import jwt from 'jsonwebtoken';
import {UserModel, UserStatus} from '../models/userModel.js';

export default async (req, res, next) => {

    const authHeader =  req?.headers;

    const authorization = authHeader?.authorization;

    if(!authorization) return res.sendStatus(401);

    const token = authorization.slice(7); // Bearer 

    if(!token) return res.sendStatus(401);

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const account = await UserModel.findById(decoded?.id).select("+password");

        if(!account) return res.sendStatus(401)

        if(account.status == UserStatus.SUSPENDED) return res.sendStatus(403);

        if(account.status == UserStatus.DELETED) return res.sendStatus(404);

        req['user'] = account;

        next();

    } catch (error) {
        return res.sendStatus(401);
    }
    
}