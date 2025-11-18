import z from "zod";


const BookSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[A-Za-z0-9 ]+$/, "name must contain alphanumerics only"),
  bookDetail: z.string().min(30),
  seriesName: z
    .string()
    .min(3)
    .regex(/^[A-Za-z0-9 ]+$/, "only alphanumerics allowed"),
  salientFeatures: z.array(z.string().min(3)),
  supportingMaterial: z.array(z.string().min(3)),
  class: z.number().nullable().optional(),
  subject: z.string().min(3),
  language: z.string().min(3),
  edition: z.number(),
  publishedBy: z.string().min(3),
  printedBy: z.string().min(3),
  publishYear: z.string().regex(/^[0-9]{4}$/, "invalid year"),
  isbn: z.string().min(13),
  nepYear: z.string().regex(/^[0-9]{4}$/, "invalid year"),
  people: z.array(
    z.object({ designation: z.string().min(3), name: z.string().min(3) })
  ),
  reviews: z.array(
    z.object({ name: z.string().min(3), stars: z.number(), review: z.string().min(3) })
  ),
  images: z.array( z.url('invalid url') ).min(1),
  tags: z.array( z.string() ).max(20), // this helps in book search
  sampleBook: z.url('invalid url').nullable(), // a link to where the books is located
  // TODO: book upload
  buyLinks: z.array(z.object({
    platform: z.string(),
    link: z.url().nullable()
  })),
});

export type BookType = z.infer<typeof BookSchema>;
export default BookSchema;