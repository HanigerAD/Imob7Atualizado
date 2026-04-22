import {Injectable} from '@angular/core';
import Swal from 'sweetalert2';

@Injectable()
export class AlertService {

  public success(alertText): void {
    Swal.fire({
      title: 'Sucesso!',
      text: alertText,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    });
  }

  public warning(alertText): void {
    Swal.fire({
      title: 'Atenção!',
      text: alertText,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    });
  }

  public error(alertText): void {
    Swal.fire({
      title: 'Erro!',
      text: alertText,
      icon: 'error',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    });
  }

}
