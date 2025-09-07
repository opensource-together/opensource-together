import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

export function DeleteProfileDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete the profile of the currently authenticated user',
    }),
    ApiResponse({
      status: 200,
      description: 'The profile has been successfully deleted',
    }),
    ApiResponse({ status: 500, description: 'Internal server error' }),
  );
}
