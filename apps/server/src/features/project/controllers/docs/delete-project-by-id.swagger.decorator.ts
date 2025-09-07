import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function DeleteProjectByIdDocs() {
  return applyDecorators(
    ApiOperation({ summary: 'Supprimer un projet' }),
    ApiResponse({
      status: 200,
      description: 'Projet supprimé avec succès',
      example: { message: 'Project deleted successfully' },
    }),
  );
}
