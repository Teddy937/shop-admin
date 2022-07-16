import { Parser } from "json2csv";
import { getManager } from "typeorm"
import { Order } from "../entities/order.entity"
import { Order_item } from "../entities/order_item.entity";

export const Orders = async (req: any, res: any) => {
    try {
        const repository = getManager().getRepository(Order)
        const take = 15;
        const page = parseInt(req.query.page as string || '1');
        const [data, total] = await repository.findAndCount({
            take,
            skip: (page - 1) * take,
            relations: ['order_items']
        });
        res.send({
            data: data.map((order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                items: order.order_items
            })),
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


export const Export = async (req: any, res: any) => {
    const parser = new Parser({
        fields: ["ID", "Name", "Email", "Product Title", "Price", "Quantity"]
    });
    const repository = getManager().getRepository(Order);
    const orders = await repository.find({ relations: ['order_items'] });
    const json = [];

    orders.forEach((order: Order) => {
        json.push({
            ID: order.id,
            Name: order.name,
            Email: order.email,
            "Product Title": "",
            Price: "",
            Quantity: "",
        });

        order.order_items.forEach((item: Order_item) => {
            json.push({
                ID: "",
                Name: "",
                Email: "",
                "Product Title": item.product_title,
                Price: item.price,
                Quantity: item.quantity,
            })
        });
    });

    const csv = parser.parse(json);
    res.header("Content-Type", "text/csv");
    res.attachment('orders.csv');
    res.send(csv);
}

export const Chart = async (req: any, res: any) => {
    try {
        const manager = getManager();
        const result = await manager.query(`SELECT DATE_FORMAT(o.created_at, "%Y-%m-%d") as date, SUM(oi.price * oi.quantity) as sum
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY date`);
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}