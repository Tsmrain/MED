import * as yup from 'yup';

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

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
    .min(8, 'Número muy corto')
    .max(15, 'Número muy largo'),
  password: yup.string()
    .required('Ingresa tu contraseña'),
}).required();

export type LoginFormData = yup.InferType<typeof loginSchema>;
export { loginSchema };
