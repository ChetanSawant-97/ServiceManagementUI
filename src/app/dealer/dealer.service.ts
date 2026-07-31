import { Injectable } from '@angular/core';
import { BaseApiService } from '../common/base-api-service';
import { DealerMaster } from './models/DealerMaster';
import { ApiEndpoints } from '../common/ApiConstants';


@Injectable({ providedIn: 'root' })
export class DealerService {

  constructor(private api: BaseApiService) {}

  getDealer(id: number) {
    // TResponse = Dealer
    return this.api.request<DealerMaster>(
      ApiEndpoints['GET_DEALER_BY_ID'], 
      { dealerId: id }
    );
  }

//   updateDealer(id: number, payload: DealerMaster) {
//     // TResponse = Dealer, TBody = UpdateDealerDto
//     return this.api.request<DealerMaster, DealerMaster>(
//       ApiEndpoints['UPDATE_DEALER'], 
//       { dealerId: id }, 
//       payload
//     );
//   }

  deleteDealer(id: number) {
    return this.api.request<void>(
      ApiEndpoints['DELETE_DEALER'], 
      { dealerId: id }
    );
  }
}