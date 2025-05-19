import * as yup from 'yup';

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

// Helper function to validate Bolivian phone numbers
const isValidBolivianPhoneNumber = (phone: string) => {
  // Bolivian phone numbers are 8 digits long
  return /^[67]\d{7}$/.test(phone);
};

const loginSchema = yup.object({
  country: yup.object({
    code: yup.string().required('Selecciona un país'),
    name: yup.string().required(),
    flag: yup.string().required(),
    dialCode: yup.string().required(),
  }).required('Selecciona un país'),
  phoneNumber: yup.string()
    .required('Ingresa tu número de teléfono')
    .matches(/^\d+$/, 'Solo números permitidos')
    .test('is-valid-phone', 'Número de teléfono inválido', function(value) {
      if (!value) return false;
      const country = this.parent.country;
      
      // Special validation for Bolivian numbers
      if (country.code === 'BO') {
        return isValidBolivianPhoneNumber(value);
      }
      
      // General validation for other countries
      return value.length >= 8 && value.length <= 15;
    }),
  password: yup.string()
    .required('Ingresa tu contraseña'),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;
export { loginSchema };
