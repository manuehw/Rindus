import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(birthDate: string): number {
    const birthDateToDate = new Date(birthDate);
    const today = new Date();

    const age = today.getFullYear() - birthDateToDate.getFullYear();

    return today.getMonth() < birthDateToDate.getMonth() ||
      (today.getMonth() === birthDateToDate.getMonth() &&
        today.getDate() < birthDateToDate.getDate())
      ? age - 1
      : age;
  }
}
