import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Connection, Repository } from 'typeorm';
import { VehicleDto } from '../../dtos/vehicle.dto';
import { GetAllVehiclesQuery } from '../../queries/get-all-vehicles.query';
import { GetVehicleByIdQuery } from '../../queries/get-vehicle-by-id.query';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../domain/entities/category.entity';

@QueryHandler(GetAllVehiclesQuery)
export class GetAllVehiclesHandler
  implements IQueryHandler<GetAllVehiclesQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async execute(query: GetAllVehiclesQuery): Promise<VehicleDto[]> {
    const vehicles = await this.vehicleRepository
      .createQueryBuilder()
      .where('state = :state', { state: 0 })
      .leftJoinAndSelect(
        'categories',
        'categories',
        'categories.vehicleId = vehicle.id',
      )
      .getMany();
    console.log(
      '🚀 ~ file: vehicles-queries.handler.ts:18 ~ GetAllVehiclesHandler ~ execute ~ vehicles:',
      vehicles,
    );

    const vehicleDtos: VehicleDto[] = vehicles.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.name = vehicle.getName().getValue();
      vehicleDto.brand = vehicle.brand.getValue();
      vehicleDto.model = vehicle.getModel().getValue();
      vehicleDto.integrity = vehicle.getIntegrity().getValue();
      vehicleDto.state = vehicle.getState();
      vehicleDto.year = vehicle.year;
      vehicleDto.categories = [''];
      return vehicleDto;
    });

    return vehicleDtos;
  }
}

@QueryHandler(GetVehicleByIdQuery)
export class GetVehicleByIdHandler
  implements IQueryHandler<GetVehicleByIdQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetVehicleByIdQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
    FROM vehicles
    LEFT JOIN categories ON vehicles.id = categories.vehicleId
    WHERE vehicles.id = ?
    GROUP BY vehicles.id
`;
    const result = await manager.query(sql, [query.vehicleId]);

    if (result.length === 0) {
      return null;
    }

    const vehicle = result[0];

    const vehicleDto = new VehicleDto();
    vehicleDto.name = vehicle.name;
    vehicleDto.brand = vehicle.brand;
    vehicleDto.model = vehicle.model;
    vehicleDto.integrity = vehicle.integrity;
    vehicleDto.state = vehicle.state;
    vehicleDto.year = vehicle.year;
    vehicleDto.categories = vehicle.categories
      ? vehicle.categories.split(',')
      : [];

    return vehicleDto;
  }
}
