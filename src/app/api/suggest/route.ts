import { createSuggestion } from "@/services/suggestionService";
import { z } from "zod";

const SuggestionSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.formData();
  } catch {
    console.log(body);
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SuggestionSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const review = await createSuggestion(
      parsed.data.title,
      parsed.data.description
    );
    return Response.json(review, { status: 201 });
  } catch (error) {
    /*
        if (error instanceof ReviewServingNotFoundError) {
            return Response.json({ error: error.message }, { status: 404 });
        }
        */
    console.error("Failed to create suggestion", error);
    return Response.json(
      { error: "Failed to create suggestion" },
      { status: 500 }
    );
  }
}
