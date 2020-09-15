import { Pipe, PipeTransform } from '@angular/core';
/*
 * Calculates the respective proficiency bonus from level
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   input | plusIfNotNegative
 * Example:
 *   {{ 10 | plusIfNotNegative }}
 *   formats to: +10
 *   {{ -10 | plusIfNotNegative }}
 *   formats to: -10
*/
@Pipe({ name: 'plusIfNotNegative' })
export class PlusIfNotNegative implements PipeTransform {
    transform(input: number): string {
        if (input > 0) return "+" + input;
        if (input < 0) return input.toString();
        if (input == 0) return "+" + input;
        // return input >= 0 ? "+" + input : input.toString();
    }
}