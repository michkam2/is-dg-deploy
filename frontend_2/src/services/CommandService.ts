import { Command, CommandFrame } from 'src/models/Command';
import { api } from '@/utils/api';

class CommandService {
  async createCommand(command: CommandFrame): Promise<Command> {
    return await api<Command>('jobs/command/createCommand', {
      method: 'POST',
      body: command,
    });
  }

  async getCommand(id: string): Promise<Command> {
    return await api<Command>(`jobs/command/getCommandById/${id}`);
  }

  async getCommandByName(name: string): Promise<Command> {
    return await api<Command>(`jobs/command/getCommandByName/${name}`);
  }

  async getCommands(sortBy: string, sortDirection: string): Promise<Command[]> {
    return await api<Command[]>(`jobs/command/getAllCommands/${sortBy}/${sortDirection}`);
  }

  async deleteCommand(id: string): Promise<void> {
    await api(`jobs/command/deleteCommand/${id}`, {
      method: 'DELETE',
    });
  }

  async updateCommand(command: CommandFrame, id: string): Promise<Command> {
    return await api<Command>(`jobs/command/updateCommand/${id}`, {
      method: 'PUT',
      body: command,
    });
  }
}

export default new CommandService();
