'use server';
/**
 * @fileOverview A Genkit flow for generating or expanding product descriptions using AI.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  nombre: z.string().describe('El nombre del producto.'),
  descripcionBasica: z
    .string()
    .describe('Una descripción básica inicial del producto.'),
  precio: z.number().describe('El precio actual del producto.'),
  disponibilidad: z
    .string()
    .describe('El estado de disponibilidad del producto (ej. "En stock", "Bajo pedido").'),
  caracteristicasAdicionales: z
    .string()
    .optional()
    .describe('Cualquier característica adicional relevante del producto.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.string().describe('La descripción detallada y ampliada del producto generada por IA.');
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Eres un agente de ventas experto y tu tarea es generar o ampliar descripciones de productos para una factura. La descripción debe ser detallada, persuasiva y relevante, adecuada para el cliente final y para el registro de la venta. Incorpora todos los detalles proporcionados a continuación.

Producto: {{{nombre}}}
Descripción Básica: {{{descripcionBasica}}}
Precio: $ {{{precio}}}
Disponibilidad: {{{disponibilidad}}}

{{#if caracteristicasAdicionales}}
Características Adicionales: {{{caracteristicasAdicionales}}}
{{/if}}

Genera una descripción completa y atractiva en español, destacando los puntos clave y adaptando el texto para una factura.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
