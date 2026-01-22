import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dataSourceOptions } from './database/data-source';

config();

export default new DataSource(dataSourceOptions);
