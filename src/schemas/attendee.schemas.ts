/**
 * Esquema de validación para la inscripción de asistentes a eventos.
 *
 * Utiliza `zod` para garantizar que los datos proporcionados sean válidos antes de procesarlos.
 *
 * @property {boolean} remainders - Indica si el usuario desea recibir recordatorios. Es obligatorio.
 */
import { boolean, object } from "zod";

export const AttendeeSchema = object({
  remainders: boolean({ required_error: "Parameter 'remainders' is required" }),
});
