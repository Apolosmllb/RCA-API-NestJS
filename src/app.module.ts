import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RentingManagementModule } from "./renting-management/renting-management.module";
import { BillingManagementModule } from "./billing-management/billing-management.module";
import { SubscriptionManagementModule } from "./subscription-management/subscription-management.module";
import { WorkshopServiceManagementModule } from "./workshop-service-management/workshop-service-management.module";
import { SharedModule } from "./shared/shared.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { IamManagementModule } from "./iam-management/iam-management.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    TypeOrmModule.forRoot({
      type: "mysql",
      host: "rca-parsimonia-server.mysql.database.azure.com",
      port: 3306,
      username: "rca123parsimonia",
      password: "edco-password1",
      database: "rca-db",
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      migrationsRun: true,
      logging: true,
      //timezone: '+0',
      bigNumberStrings: false,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      },
      entities: [
        process.env.ENVIRONMENT == "prod"
          ? "**/domain/entities/*.js"
          : "dist/**/domain/entities/*.js"
      ]
    }),
    RentingManagementModule,
    BillingManagementModule,
    SubscriptionManagementModule,
    WorkshopServiceManagementModule,
    SharedModule,
    IamManagementModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
