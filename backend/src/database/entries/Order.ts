import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"
@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    order_id!: number;

    @Column()
    order_token!: string;

    @Column()
    order_email!: string;

    @Column()
    order_phone!: string;

    @Column()
    order_verified!: boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    order_createdAt!: Date;
}