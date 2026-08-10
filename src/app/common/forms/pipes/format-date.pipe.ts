import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Regular expression to exactly match yyyy-mm-dd
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (dateRegex.test(value)) {
      // Split using the hyphen instead of a slash
      const [year, month, day] = value.split('-');
      const monthIndex = parseInt(month, 10) - 1;

      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const monthName = months[monthIndex];

      // Prevent invalid months (e.g., 2026-15-01)
      if (!monthName) {
        return value; 
      }

      return `${day} ${monthName} ${year}`;
    }

    // Return the original string if it doesn't match the format
    return value;
  }
}