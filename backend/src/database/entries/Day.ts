import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("days")
export class Day {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

    @Column()
    slug!: string;
}