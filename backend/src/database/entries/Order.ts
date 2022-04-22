import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    order_id!: number

    @Column()
    order_token!: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    order_createdAt!: Date
}