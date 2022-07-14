import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import bcryptjs from 'bcryptjs'

export const users = async (req: any, res: any) => {
    const take = 15;
    const page = parseInt(req.query.page as string || '1');
    const repository = getManager().getRepository(User);
    const [data, total] = await repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations: ["role"]
    });
    res.send({
        data: data.map(u => {
            const { password, ...data } = u;
            return data
        }),
        meta: {
            total,
            page,
            last_page: Math.ceil(total / take)
        }
    });
}

export const createUser = async (req: { body: any }, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const { role_id, ...body } = req.body
        const hashed_password = await bcryptjs.hash('12345', 10);
        const repository = getManager().getRepository(User);
        const { password, ...user } = await repository.save({ ...body, password: hashed_password, role: { id: role_id } })
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" })
    }
}

export const getUserById = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(User);
        const { password, ...user } = await repository.findOne({ where: { id: req.params.id }, relations: ['role'] });
        if (!user) {
            res.status(404).send({ message: "User does not exists" })
        }
        res.send(user);
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" })
    }
}

export const updateUser = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(User);
        const { role_id, ...body } = req.body
        const user = await repository.update(req.params.id, { ...body, role: { id: role_id } });
        const { password, ...data } = await repository.findOne({ where: { id: req.params.id }, relations: ['role'] });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" })
    }
}

export const deleteUser = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(User);
        repository.delete(req.params.id);
        res.status(200).send({ message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" })
    }
}