import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Tipo } from "./Tipo";
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tipo, (tipo) => tipo.schools)
  tipo: Tipo;

  @ManyToOne(() => Localidad, (localidad) => localidad.centroEducativo)
  localidad: Localidad;
}
