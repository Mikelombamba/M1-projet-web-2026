import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      autoLoadEntities: true, // Charge automatiquement toutes les entités ci-dessus
      synchronize: true,      // Recrée les tables si tu supprimes le fichier .sqlite
    }),
  ],
})
export class DatabaseModule {}