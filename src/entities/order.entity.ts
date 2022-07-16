import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order_item } from "./order_item.entity";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: string;

    @OneToMany(() => Order_item, orderItem => orderItem.order)
    order_items: Order_item[]

    get name(): string {
        return `${this.first_name} ${this.last_name}`
    }

    get total(): number {
        return this.order_items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }
}