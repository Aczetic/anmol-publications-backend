import z from "zod";



const FaqSchema = z.object({
    question: z.string(),
    answer: z.string(),
})

type faqType = z.infer<typeof FaqSchema>;
export default FaqSchema;