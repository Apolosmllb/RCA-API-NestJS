import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Connection, Repository } from 'typeorm';
import { VehicleDto } from '../../dtos/vehicle.dto';
import { GetAllVehiclesQuery } from '../../queries/get-all-vehicles.query';
import { GetVehicleByIdQuery } from '../../queries/get-vehicle-by-id.query';
import { Vehicle } from 'src/renting-management/domain/entities/vehicle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllVehiclesByYearQuery } from '../../queries/get-all-vehicles-by-year.query';
import { GetAllVehiclesByStarsQuery } from '../../queries/get-all-vehicles-by-stars.query';
import { GetVehiclesByOwnerIdQuery } from '../../queries/get-vehicles-by-ownerId.query';
import { Get20VehiclesMixedQuery } from '../../queries/get-20-vehicles-mixed.query';

@QueryHandler(GetAllVehiclesQuery)
export class GetAllVehiclesHandler
  implements IQueryHandler<GetAllVehiclesQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {}

  async execute(query: GetAllVehiclesQuery): Promise<VehicleDto[]> {
    const vehicles = await this.vehicleRepository.find({
      relations: {
        categories: true,
        owner: true,
      },
    });
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
      vehicleDto.ownerId = vehicle.owner?.id;
      vehicleDto.image = vehicle.image;
      vehicleDto.stars = vehicle.stars;
      vehicleDto.price = vehicle.price;
      vehicleDto.currency = vehicle.currency;
      vehicleDto.timeUnit = vehicle.timeUnit;
      vehicleDto.categories = vehicle.categories.map((category) =>
        category.getName().getValue(),
      );
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
    vehicleDto.id = vehicle.id;
    vehicleDto.name = vehicle.name;
    vehicleDto.brand = vehicle.brand;
    vehicleDto.model = vehicle.model;
    vehicleDto.integrity = vehicle.integrity;
    vehicleDto.state = vehicle.state;
    vehicleDto.year = vehicle.year;
    vehicleDto.ownerId = vehicle.owner_id;
    vehicleDto.image = vehicle.image;
    vehicleDto.stars = vehicle.stars;
    vehicleDto.price = vehicle.price;
    vehicleDto.currency = vehicle.currency;
    vehicleDto.timeUnit = vehicle.timeUnit;
    vehicleDto.categories = vehicle.categories
      ? vehicle.categories.split(',')
      : [];

    return vehicleDto;
  }
}

@QueryHandler(GetAllVehiclesByYearQuery)
export class GetAllVehiclesByYearHandler
  implements IQueryHandler<GetAllVehiclesByYearQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetAllVehiclesByYearQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
    FROM vehicles
    LEFT JOIN categories ON vehicles.id = categories.vehicleId
    WHERE YEAR(vehicles.year) = (SELECT MAX(YEAR(year)) FROM vehicles)
    GROUP BY vehicles.id
    `;

    const result = await manager.query(sql);

    if (result.length === 0) {
      return null;
    }

    const vehicleDtos: VehicleDto[] = result.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.id = vehicle.id;
      vehicleDto.name = vehicle.name;
      vehicleDto.brand = vehicle.brand;
      vehicleDto.model = vehicle.model;
      vehicleDto.integrity = vehicle.integrity;
      vehicleDto.state = vehicle.state;
      vehicleDto.year = vehicle.year;
      vehicleDto.ownerId = vehicle.owner_id;
      vehicleDto.image = vehicle.image;
      vehicleDto.stars = vehicle.stars;
      vehicleDto.price = vehicle.price;
      vehicleDto.currency = vehicle.currency;
      vehicleDto.timeUnit = vehicle.timeUnit;
      vehicleDto.categories = vehicle.categories
        ? vehicle.categories.split(',')
        : [];
      return vehicleDto;
    });

    return vehicleDtos;
  }
}

@QueryHandler(GetAllVehiclesByStarsQuery)
export class GetAllVehiclesByStarsHandler
  implements IQueryHandler<GetAllVehiclesByStarsQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetAllVehiclesByStarsQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
        FROM vehicles
        LEFT JOIN categories ON vehicles.id = categories.vehicleId
        GROUP BY vehicles.id
        ORDER BY vehicles.stars DESC
        LIMIT 10
    `;

    const result = await manager.query(sql);

    if (result.length === 0) {
      return null;
    }

    const vehicleDtos: VehicleDto[] = result.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.id = vehicle.id;
      vehicleDto.name = vehicle.name;
      vehicleDto.brand = vehicle.brand;
      vehicleDto.model = vehicle.model;
      vehicleDto.integrity = vehicle.integrity;
      vehicleDto.state = vehicle.state;
      vehicleDto.year = vehicle.year;
      vehicleDto.ownerId = vehicle.owner_id;
      vehicleDto.image = vehicle.image;
      vehicleDto.stars = vehicle.stars;
      vehicleDto.price = vehicle.price;
      vehicleDto.currency = vehicle.currency;
      vehicleDto.timeUnit = vehicle.timeUnit;
      vehicleDto.categories = vehicle.categories
        ? vehicle.categories.split(',')
        : [];
      return vehicleDto;
    });

    return vehicleDtos;
  }
}

@QueryHandler(GetVehiclesByOwnerIdQuery)
export class GetAllVehiclesByByOwnerHandler
  implements IQueryHandler<GetVehiclesByOwnerIdQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly connection: Connection,
  ) {}

  async execute(query: GetVehiclesByOwnerIdQuery) {
    console.log('asffssaafafasf');
    const manager = this.connection.manager;
    const sql = `
    SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
    FROM vehicles
    LEFT JOIN categories ON vehicles.id = categories.vehicleId
    WHERE vehicles.owner_id = ?
    GROUP BY vehicles.id
    `;

    const result = await manager.query(sql, [query.owner?.id]);

    if (result.length === 0) {
      return null;
    }

    const vehicleDtos: VehicleDto[] = result.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.id = vehicle.id;
      vehicleDto.name = vehicle.name;
      vehicleDto.brand = vehicle.brand;
      vehicleDto.model = vehicle.model;
      vehicleDto.integrity = vehicle.integrity;
      vehicleDto.state = vehicle.state;
      vehicleDto.year = vehicle.year;
      vehicleDto.ownerId = vehicle.owner_id;
      vehicleDto.image = vehicle.image;
      vehicleDto.stars = vehicle.stars;
      vehicleDto.price = vehicle.price;
      vehicleDto.currency = vehicle.currency;
      vehicleDto.timeUnit = vehicle.timeUnit;
      vehicleDto.categories = vehicle.categories
        ? vehicle.categories.split(',')
        : [];
      return vehicleDto;
    });

    return vehicleDtos;
  }
}

//Get20VehiclesMixedQuery
@QueryHandler(Get20VehiclesMixedQuery)
export class Get20VehiclesMixedHandler
  implements IQueryHandler<Get20VehiclesMixedQuery>
{
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    private readonly connection: Connection,
  ) {}

  async execute(query: Get20VehiclesMixedQuery) {
    const manager = this.connection.manager;
    const sql = `
    SELECT vehicles.*, GROUP_CONCAT(categories.category) as categories
    FROM vehicles
    LEFT JOIN categories ON vehicles.id = categories.vehicleId
    GROUP BY vehicles.id
    ORDER BY RAND()
    LIMIT 20;
    `;

    const result = await manager.query(sql);

    if (result.length === 0) {
      return null;
    }

    const vehicleDtos: VehicleDto[] = result.map((vehicle) => {
      const vehicleDto = new VehicleDto();
      vehicleDto.id = vehicle.id;
      vehicleDto.name = vehicle.name;
      vehicleDto.brand = vehicle.brand;
      vehicleDto.model = vehicle.model;
      vehicleDto.integrity = vehicle.integrity;
      vehicleDto.state = vehicle.state;
      vehicleDto.year = vehicle.year;
      vehicleDto.ownerId = vehicle.owner_id;
      vehicleDto.image = vehicle.image;
      vehicleDto.stars = vehicle.stars;
      vehicleDto.price = vehicle.price;
      vehicleDto.currency = vehicle.currency;
      vehicleDto.timeUnit = vehicle.timeUnit;
      vehicleDto.categories = vehicle.categories
        ? vehicle.categories.split(',')
        : [];
      return vehicleDto;
    });

    return vehicleDtos;
  }
}
