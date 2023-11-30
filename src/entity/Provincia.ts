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

  @Column()
  codigo: number;

  @Column()
  nombre: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[];
}
