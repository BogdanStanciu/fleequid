import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Pool, request } from 'undici';
import { createItem } from './mocks/create-item';

@Injectable()
export class AppService {
  private logger: Logger;
  private client: Pool;

  private userCredential = {
    username: 'user.a',
    password: '1234',
  };

  constructor(@InjectRedis() private readonly redis: Redis) {
    this.logger = new Logger(AppService.name);
    this.client = new Pool(
      process.env.SERVICE_A_URL
        ? process.env.SERVICE_A_URL
        : 'http://localhost:3000',
    );
  }

  /**
   * This method will provide an authentication token for the given user
   * @returns {Promise<string>}
   */
  private async getAuthToken(): Promise<string> {
    this.logger.log(`Get auth token for user ${this.userCredential.username}`);

    const result = await this.client.request({
      path: '/auth/login',
      method: 'POST',
      body: JSON.stringify(this.userCredential),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result.statusCode !== 201) {
      throw new BadRequestException();
    }

    return ((await result.body.json()) as { access_token: string })
      .access_token;
  }

  /**
   * Test a simple get/:id and get request
   * on service A and save the data on mongo
   */
  async getFlowTest(): Promise<void> {
    let path = '/items?limit=20&offset=0';
    this.logger.log(`Call service A for items listing`);

    this.logger.log(`Call service A on GET ${path}`);
    let result = await this.client.request({
      path: path,
      method: 'GET',
    });

    if (result.statusCode !== 200) {
      throw new InternalServerErrorException();
    }

    this.logger.log(`Save response on redis...`);
    const data: any = await result.body.json();

    try {
      await this.redis.set(path, JSON.stringify(data));
    } catch (err) {
      throw new InternalServerErrorException(err.toString());
    }

    if (!data[0]?._id) {
      throw new InternalServerErrorException('Missing data from service A');
    }

    const id = data[0]._id;

    this.logger.log(`Get single item: ${id}`);
    path = `/items/${id}`;
    this.logger.log(`Call service A on GET ${path}`);

    result = await this.client.request({
      path: path,
      method: 'GET',
    });

    if (result.statusCode !== 200) {
      throw new InternalServerErrorException();
    }

    this.logger.log(`Save response on redis...`);

    try {
      await this.redis.set(path, await result.body.text());
    } catch (err) {
      throw new InternalServerErrorException(err.toString());
    }
  }

  async insertFlowTest(retry: number = 0): Promise<void> {
    if (retry > 3) {
      throw new InternalServerErrorException('To many retry to service A');
    }

    // authentication
    const token = await this.getAuthToken();

    if (!token) {
      throw new InternalServerErrorException('No auth token');
    }

    let path = '/items';
    this.logger.log(`Call service A on POST ${path}`);

    let result = await this.client.request({
      path,
      method: 'POST',
      body: JSON.stringify(createItem),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (result.statusCode === 401) {
      this.insertFlowTest(retry + 1);
    }

    if (result.statusCode !== 201) {
      throw new InternalServerErrorException('Service A Error');
    }

    const data: any = await result.body.json();
    path = `/items/${data._id}`;

    this.logger.log(`Call service A on PUT ${path}`);

    result = await this.client.request({
      path,
      method: 'PUT',
      body: JSON.stringify({ ...createItem, price: 2000 }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (result.statusCode === 401) {
      this.insertFlowTest(retry + 1);
    }

    if (result.statusCode !== 200) {
      throw new InternalServerErrorException('Service A Error');
    }

    this.logger.log(`Call service A on DELETE ${path}`);
    const { statusCode } = await this.client.request({
      path,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (statusCode !== 200) {
      throw new InternalServerErrorException('Service A Error');
    }
  }
}
