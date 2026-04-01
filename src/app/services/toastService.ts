import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'toast-top-right'
  | 'toast-top-left'
  | 'toast-bottom-right'
  | 'toast-bottom-left'
  | 'toast-top-center'
  | 'toast-bottom-center';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastr: ToastrService) {}

  show(options: {
    title: string;
    description: string;
    variant?: ToastVariant;
    position?: ToastPosition;
  }) {
    const {
      title,
      description,
      variant = 'info',
      position = 'toast-top-right'
    } = options;

    const config: Partial<IndividualConfig> = {
      positionClass: position
    };

    switch (variant) {
      case 'success':
        this.toastr.success(description, title, config);
        break;

      case 'error':
        this.toastr.error(description, title, config);
        break;

      case 'warning':
        this.toastr.warning(description, title, config);
        break;

      default:
        this.toastr.info(description, title, config);
    }
  }
}