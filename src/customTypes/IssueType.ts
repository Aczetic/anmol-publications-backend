import z from "zod";


const IssueSchema = z.object({
   name: z.string().regex(/^[a-zA-Z ]+$/, 'Invalid Name'),
   subject: z.string().min(4).max(100),
   issue: z.string().min(30).max(800),
})

type issueType = z.infer<typeof IssueSchema>;
export default IssueSchema;