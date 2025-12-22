import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator to check if two form controls match.
 * This is typically used for password confirmation fields where the value
 * of the main control (e.g., password) needs to match the value of the
 * matching control (e.g., confirm password).
 *
 * @param {string} controlName - The name of the main control to validate.
 * @param {string} matchingControlName - The name of the control to match with the main control.
 * @returns {ValidatorFn} - A function that can be used as a validator on a form group.
 */
export function matchValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Retrieve the main control and the control to match with
    const mainControl = control.get(controlName);
    const matchControl = control.get(matchingControlName);

    // If either control is missing, skip validation
    if (!mainControl || !matchControl) {
      return null; // Skip validation if controls are missing
    }

    // If the matchControl already has errors and the error isn't from this validator, skip validation
    if (matchControl.errors && !matchControl.errors['confirmedValidator']) {
      return null; // Skip if matchControl has unrelated errors
    }

    // Check if the values of the two controls match
    if (mainControl.value !== matchControl.value) {
      // Set an error on the matchControl indicating the mismatch
      matchControl.setErrors({ ...matchControl.errors, confirmedValidator: true });
      return { confirmedValidator: true }; // Return an error indicating validation failure
    } else {
      // If the values match, remove any errors from the matchControl
      const otherErrors = { ...matchControl.errors };
      delete otherErrors['confirmedValidator']; // Remove the confirmedValidator error if present
      matchControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null); // Clear the errors if no others remain
      return null; // No errors if values match
    }
  };
}
