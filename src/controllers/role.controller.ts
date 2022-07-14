import { getManager } from "typeorm"
import { Role } from '../entities/role.entity'
export const Roles = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Role)
        const roles = await repository.find()
        res.send(roles)
    } catch (error) {
        res.status(500).send("Something went wrong")
    }
}


export const createRole = async (req: any, res: any) => {
    try {
        const { name, permissions } = req.body;
        const repository = getManager().getRepository(Role);
        const role = await repository.save({
            name, permissions: permissions.map(id => ({ id }))
        })
        res.send(role);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const getRole = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Role);
        res.send(await repository.findOne({ where: { id: req.params.id }, relations: ['permissions'] }));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

export const updateRole = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Role);
        const { name, permissions } = req.body;
        const role = await repository.save({
            id: parseInt(req.params.id),
            name, permissions: permissions.map(id => ({ id }))
        })
        res.send(role);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }

}

export const deleteRole = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Role);
        await repository.delete(req.params.id);
        res.status(200).send({ message: "Role deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}