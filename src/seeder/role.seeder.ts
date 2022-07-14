import { createConnection, getManager } from "typeorm";
import { Permission } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";

createConnection().then(async connection => {
    const permissionRepository = getManager().getRepository(Permission);
    const perms = ["view_users", "edit_users", "view_roles", "edit_roles", "view_products", "edit_products", "view_orders", "edit_orders"];
    let permissions = [];
    for (let i = 0; i < perms.length; i++) {
        permissions.push(await permissionRepository.save({ name: perms[i] }))
    }

    const roleRepository = getManager().getRepository(Role);

    //save role and assign all permissions
    await roleRepository.save({ name: 'Admin', permissions })

    //delete permission with index 3
    delete permissions[3];

    //save Editor role with edit_roles permission
    await roleRepository.save({ name: 'Editor', permissions })

    delete permissions[1];
    delete permissions[5];
    delete permissions[7];

    await roleRepository.save({ name: "Viewer", permissions })
    process.exit(0)
})