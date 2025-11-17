import z from "zod";


const TestimonialSchema = z.object({
    name: z.string(),
    designation: z.string(),
    location: z.string(),
    review: z.string(),
    stars: z.number(),
    img: z.url()
})

export type TestimonialType = z.infer<typeof TestimonialSchema>;
export default TestimonialSchema;