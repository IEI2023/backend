import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Localidad } from "./Localidad";

@Entity()
export class Provincia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  codigo: number;

  @Column({ nullable: true })
  nombre: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[];
}
