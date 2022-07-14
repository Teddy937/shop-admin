import { getManager } from "typeorm";
import bcryptjs from 'bcryptjs'
import { Product } from "../entities/product.entity";
import { productValidation } from "./validation/product.validation";

export const Products = async (req: any, res: any) => {
    try {
        const take = 15;
        const page = parseInt(req.query.page as string || '1');
        const repository = getManager().getRepository(Product);
        const [data, total] = await repository.findAndCount({
            take,
            skip: (page - 1) * take
        });
        res.send({
            data,
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const createProduct = async (req: { body: any }, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const { error } = productValidation.validate(req.body)
        if (error) {
            res.status(500).send(error.details)
        }
        const repository = getManager().getRepository(Product);
        const product = await repository.save(req.body)
        res.send(product);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const getProductById = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(Product);
        res.send(await repository.findOne({ where: { id: req.params.id } }));
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const updateProduct = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(Product);
        const product = await repository.update(req.params.id, req.body);
        const data = await repository.findOne({ where: { id: req.params.id } });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

export const deleteProduct = async (req: {
    params: any; body: any
}, res: {
    status: any; send: (arg0: any) => any
}) => {
    try {
        const repository = getManager().getRepository(Product);
        repository.delete(req.params.id);
        res.status(200).send({ message: "Product deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}