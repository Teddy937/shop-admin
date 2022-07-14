import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('permissions')
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: string

}