import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import { registerValidation } from "./validation/register.validation"
import bcryptjs from 'bcryptjs'
import { sign, verify } from "jsonwebtoken";


//register user
export const Register = async (req: { body: any }, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const body = req.body
        const { error } = registerValidation.validate(body);
        if (error) {
            return res.status(400).send(error.details)
        }
        if (body.password != body.password_confirm) {
            return res.status(400).send({
                message: "Passwords do not match"
            })
        }
        const repository = getManager().getRepository(User);
        const { password, ...user } = await repository.save({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: await bcryptjs.hash(body.password, 10),
            role: { id: body.role_id }
        });
        res.send(user)
    } catch (error) {
        res.status(500).send(error);
    }

}

//login user
export const Login = async (req: { body: any }, res: {
    cookie: any;
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(User);
        const user = await repository.findOne({ where: { email: req.body.email } });
        if (!user) {
            res.status(404).send({
                message: "Invalid credentials"
            })
        }

        if (!await bcryptjs.compare(req.body.password, user.password)) {
            res.status(400).send({
                message: "Invalid credentials"
            })
        }

        const token = sign({
            id: user.id
        }, process.env.SECRET_KEY);

        res.cookie("jwt", token, {
            httpOnly: true, // only backend can access and use it
            maxAge: 24 * 60 * 60 * 1000 //1 day
        });
        res.send({
            message: "success"
        })

    } catch (error) {
        res.status(500).send({ message: "Something went wrong" })
    }
}

//get athenticated user
export const AuthenticatedUser = async (req: {
    cookies: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    res.send(req["user"]);
}

//logout user
export const Logout = async (req: {
    cookies: any; body: any
}, res: {
    cookie: any;
    status: any; send: (arg0: any) => any
}) => {
    res.cookie('jwt', '', { maxAge: 0 });
    res.send({ message: "Logout successful" })
}

// update user profile
export const updateProfile = async (req: { body: any }, res: {
    status: any; send: (arg0: any) => any
}) => {
    const user = req["user"];
    const repository = getManager().getRepository(User);
    await repository.update(user.id, req.body);
    const { password, ...user_data } = await repository.findOne({ where: { id: user.id } });
    res.send(user_data);
}

//update user password
export const updatePassword = async (req: { body: any }, res: {
    status: any; send: (arg0: any) => any
}) => {
    const user = req["user"];
    if (req.body.password != req.body.password_confirm) {
        return res.status(400).send({
            message: "Passwords do not match"
        })
    }
    const repository = getManager().getRepository(User);
    await repository.update(user.id, { password: await bcryptjs.hash(req.body.password, 10) })
    const { password, ...user_data } = user;
    res.send(user_data);
}