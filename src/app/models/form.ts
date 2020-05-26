import {
  FormControl as AngularFormControl,
  FormGroup as AngularFormGroup,
  FormArray as AngularFormArray,
  Validators as AngularValidators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";

export class FormGroup extends AngularFormGroup {
  public getControls(): {
    [key: string]: FormControl;
  } {
    return this.controls as { [key: string]: FormControl };
  }

  public getControl<T extends AbstractControl>(
    path: string | (string | number)[]
  ): T {
    return this.get(path) as T;
  }

  public mainError(): string {
    const controls = Object.values(this.getControls());
    return controls.find(c => c.invalid).mainError();
  }
}

export class FormArray extends AngularFormArray {
  public getControls(): FormControl[] {
    return this.controls as FormControl[];
  }
  public mainError(): string {
    return this.getControls()
      .find(c => c.invalid)
      .mainError();
  }
}

export class FormControl extends AngularFormControl {
  private validators: Validator[];

  constructor(formState?: any, ...validators: Validator[]) {
    super(
      formState,
      validators.map(v => v.validator)
    );
    this.validators = validators;
  }

  public displayError(): boolean {
    return this.invalid && this.touched;
  }

  public mainError(): string {
    if (!this.displayError()) return undefined;
    const [key, value] = Object.entries(this.errors)[0];
    const validatorError = this.validators.find(v => v.type === key);
    return validatorError.error;
  }
}

export class Validator {
  constructor(
    public validator: ValidatorFn,
    public type: string,
    public error: string
  ) {}

  public static requiredTrue(
    error: string = "You must check this value"
  ): Validator {
    return new Validator(AngularValidators.requiredTrue, "required", error);
  }

  public static email(
    error: string = "This mail address is invalid"
  ): Validator {
    return new Validator(AngularValidators.email, "email", error);
  }

  public static valuesEquals(
    controls: AbstractControl[],
    error: string = "Confirmation password not match"
  ): Validator {
    return new Validator(
      (control: AbstractControl): ValidationErrors => {
        const differentsControls = controls.filter(
          c => c.value !== control.value
        );
        if (differentsControls.length === 0) return null;
        return { equals: "All values are not equals" };
      },
      "equals",
      error
    );
  }

  public static required(
    error: string = "This value need to be set"
  ): Validator {
    return new Validator(AngularValidators.required, "required", error);
  }

  public static minLength(length: number, error?: string): Validator {
    error =
      error || "this value need to be upper than " + length + " character(s).";
    return new Validator(
      AngularValidators.minLength(length),
      "minlength",
      error
    );
  }
  public static lengthEqual(length: number, error?: string): Validator {
    error =
      error || "this value need to equal than " + length + " character(s).";
    return (
      new Validator(AngularValidators.maxLength(length), "maxlength", error) &&
      new Validator(AngularValidators.minLength(length), "minlength", error)
    );
  }
  public static maxLength(length: number, error?: string): Validator {
    error =
      error || "this value need to be lower than " + length + " character(s).";
    return new Validator(
      AngularValidators.maxLength(length),
      "maxlength",
      error
    );
  }

  public static pattern(regex: RegExp, error?: string): Validator {
    error = error || "Wrong value";
    return new Validator(AngularValidators.pattern(regex), "pattern", error);
  }

  public static validateCCNumber(error?: string): Validator {
    error = error || "The expiration date not match";
    return this.pattern(/^\d{4}\d{4}\d{4}\d{4}$/, error);
  }

  public static expirationDate(error?: string): Validator {
    error = error || "The expiration date not match";
    return this.pattern(/^\d{2}[2]{1}\d{1}[0-9]{2}$/, error);
  }

  public static phone(error?: string): Validator {
    error = error || "The phone number is invalid";
    return this.pattern(/[1-9](\d){8}$/, error);
  }

  public static mobilePhone(error?: string): Validator {
    error = error || "The phone number is invalid";
    return this.pattern(/(^6|7)(\d){8}$/, error);
  }
}
