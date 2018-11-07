import validate from 'validate.js';
import validation from '../constants/Validation';

export default async (fieldName, value) => {
  const formValues = { [fieldName]: value };
  const formFields = { [fieldName]: validation[fieldName] };
  return validate.async(formValues, formFields)
    .then(() => null)
    .catch(errors => errors[fieldName][0]);
};
