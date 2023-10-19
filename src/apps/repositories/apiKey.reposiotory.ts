import { ApiKey } from "apps/modules/entities/apiKey.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(ApiKey)
export class ApiKeyRepository extends Repository<ApiKey> {}
