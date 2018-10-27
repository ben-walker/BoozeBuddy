import validate from 'validate.js';
import validation from '../constants/Validation';

export default async (fieldName, value) => {
    const formValues = { [fieldName]: value };
    const formFields = { [fieldName]: validation[fieldName] }
    return validate.async(formValues, formFields)
        .then(() => { return null })
        .catch((errors) => { return errors[fieldName][0] });
};
