import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Provincia } from "./Provincia";
import { CentroEducativo } from "./CentroEducativo";

@Entity()
export class Localidad {
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

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  provincia: Provincia;

  @OneToMany(
    () => CentroEducativo,
    (centroEducativo) => centroEducativo.localidad
  )
  centroEducativo: CentroEducativo[];
}
