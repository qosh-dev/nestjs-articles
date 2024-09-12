import { Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';

export class LoggerDatabase extends Logger {
  logger = new Logger('Database');

  constructor() {
    super();
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const sql =
      this.normalizeQuery(query) +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '');
    this.logger.debug(sql);
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      this.normalizeQuery(query) +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '') +
      ' -- ERROR: ' +
      error;
    this.logger.error(sql);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    const sql =
      this.normalizeQuery(query) +
      (parameters && parameters.length
        ? ' -- PARAMETERS: ' + this.stringifyParams(parameters)
        : '') +
      ' -- TIME: ' +
      time;
    this.logger.log(sql);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.debug(message);
  }
  // ------------------------------------------------------------------------


  protected stringifyParams(parameters: any[]) {
    try {
      return JSON.stringify(parameters);
    } catch (error) {
      return parameters;
    }
  }

  protected normalizeQuery(query: string) {
    return query.replace(/\s\s+/g, ' ').trim();
  }

  // ---------------------------------------------------------------------------------------------------

}
