import { createConnection, getManager } from "typeorm";
import { faker } from '@faker-js/faker';
import { randomInt, randomUUID } from "crypto";
import { Order } from "../entities/order.entity";
import { Order_item } from "../entities/order_item.entity";

createConnection().then(async connection => {
    const itemsRepo = getManager().getRepository(Order_item);
    const orderRepository = getManager().getRepository(Order);
    for (let i = 0; i < 30; i++) {
        const order = await orderRepository.save({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            created_at: faker.date.past(2).toDateString()
        })

        for (let l = 0; l < randomInt(2, 5); l++) {
            await itemsRepo.save({
                order,
                product_title: faker.lorem.words(2),
                price: randomInt(10, 20),
                quantity: randomInt(1, 5)
            })

        }
    }
    process.exit(0)
});