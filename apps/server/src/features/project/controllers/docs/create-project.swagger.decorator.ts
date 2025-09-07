import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { CreateProjectDto } from "../dto/create-project.dto";

export function CreateProjectDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Créer un projet' }),
    ApiBody({ type: CreateProjectDto, description: 'Données du projet à créer' }),
  );
}
