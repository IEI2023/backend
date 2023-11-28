import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Localidad } from "./Localidad";

@Entity()
export class CentroEducativo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  codigoPostal: string;

  @Column()
  longitud: number;

  @Column()
  latitud: number;

  @Column()
  telefono: string;

  @Column()
  descripcion: string;

  @Column()
  tipo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Localidad, (localidad) => localidad.centroEducativo)
  localidad: Localidad;
}
