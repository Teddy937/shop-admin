import { verify } from "jsonwebtoken";
import { getManager } from "typeorm";
import { User } from "../entities/user.entity";

export const AuthMiddleware = async (req: {
    cookies: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}, next: any) => {
    try {
        const jwt = req.cookies['jwt'];
        const payload: any = verify(jwt, process.env.SECRET_KEY);
        if (!payload) {
            res.status(404).send({ message: "Unauthenticated" });
        }
        const repository = getManager().getRepository(User);
        const { password, ...user } = await repository.findOne({ where: { id: payload.id }, relations: ['role', 'role.permissions'] });
        req["user"] = user;
        next();
    } catch (error) {
        res.status(404).send({ message: "Unauthenticated" });
    }
}