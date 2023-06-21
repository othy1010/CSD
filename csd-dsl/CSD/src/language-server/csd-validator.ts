import { ValidationAcceptor, ValidationChecks } from 'langium';
import { CsdAstType, Person } from './generated/ast';
import type { CsdServices } from './csd-module';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: CsdServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.CsdValidator;
    const checks: ValidationChecks<CsdAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class CsdValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
