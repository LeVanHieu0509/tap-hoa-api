import { ApiKey } from "./../modules/entities/apiKey.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ApiKey)
export class ApiKeyRepository extends Repository<ApiKey> {}
