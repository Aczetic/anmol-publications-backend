import z from "zod";


const CareerSchema = z.object({
    title: z.string(),
    city: z.string(),
    state: z.string(),
    shift: z.string(),
    requirements: z.array(z.string()),
    responsibilities: z.array(z.string()),
})

type careersType = z.infer<typeof CareerSchema>;
export default CareerSchema;