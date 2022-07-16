export const PermissionMiddleware = (access: string) => {
    return (req: any, res: any, next: Function) => {
        const user = req['user'];
        const permissions = user.role.permissions

        if (req.method === "GET") {
            if (!permissions.some((p: { name: string; }) => (p.name === `view_${access}`) || (p.name === `edit_${access}`))) {
                res.status(401).send({ message: "Unauthorised" });
            }
        } else {
            if (!permissions.some((p: { name: string; }) => (p.name === `edit_${access}`))) {
                res.status(401).send({ message: "Unauthorised" });
            }
        }
        next();
    }
}