import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  findAll(): Promise<Client[]> {
    return this.clientRepository.find();
  }

  create(clientData: Partial<Client>): Promise<Client> {
    const newClient = this.clientRepository.create(clientData);
    return this.clientRepository.save(newClient);
  }
  async remove(id: number): Promise<void> {
    await this.clientRepository.delete(id);
  }

  async update(id: number, data: Partial<Client>): Promise<Client> {
    await this.clientRepository.update(id, data);
    const updatedClient = await this.clientRepository.findOneBy({ id });
    if (!updatedClient) {
        throw new Error(`Client avec l'id ${id} non trouvé`);
    }
    return updatedClient;
}
}
