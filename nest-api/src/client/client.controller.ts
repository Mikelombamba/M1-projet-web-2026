import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { Patch } from '@nestjs/common'; // N'oublie pas l'import !


@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Post()
  create(@Body() clientData: any) {
    return this.clientService.create(clientData);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
  return this.clientService.remove(+id); // Le + transforme le texte en nombre
}
@Patch(':id')
update(@Param('id') id: string, @Body() data: Partial<Client>) {
  return this.clientService.update(+id, data);
}

}