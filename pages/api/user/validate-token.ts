import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data = 
    | { msg: string }
    | {
        token: string;
        user: {
            email: string;
            name: string;
            role: string;
        }
    }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        switch (req.method) {
            case 'GET':
                return checkJWT(req, res);

            default:
                res.status(400).json({
                    msg: 'Bad request'
                });
        }
    } catch (error) {
        console.log(error);
    }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken( token );
    } catch (error) {
        return res.status(401).json({
            msg: 'Token de autorizacion no es valido'
        })
    }

    await db.connect();
    const user = await User.findById( userId ).lean();
    await db.disconnect();

    if (!user) {
        return res.status(400).json({
            msg: 'No existe usuario'
        })
    }

    const { _id, email, role, name } = user;

    return res.status(200).json({
        token: jwt.signToken( _id, email ),
        user: {
            email,
            role,
            name
        }
    })
}