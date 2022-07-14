import { getManager } from "typeorm"
import { Permission } from "../entities/permission.entity"

export const Permissions = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Permission);
        const permissions = await repository.find()
        res.send(permissions);
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" });
    }
}