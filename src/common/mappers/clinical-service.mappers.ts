import { ClinicalService } from "generated/prisma";
import { ClinicalServiceResponse } from "src/modules/clinical-services/dto/clinical-service.response";

export function clinicalServiceToClinicalServiceResponse(request: ClinicalService): ClinicalServiceResponse {
  return {
    id: request.id,
    name: request.name,
    description: request.description ?? '',
    price: request.price,
    duration: request.duration,
    isActive: request.isActive,
  };
}