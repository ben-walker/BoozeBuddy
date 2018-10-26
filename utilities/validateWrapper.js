import validatejs from 'validate.js';
import validation from '../constants/Validation';

export default (fieldName, value) => {
    const formValues = { [fieldName]: value };
    const formFields = { [fieldName]: validation[fieldName] }
    const result = validatejs(formValues, formFields);
    return result ? result[fieldName][0] : null;
};
