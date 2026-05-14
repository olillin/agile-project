import {
  ReviewServingNotFoundError,
  ReviewUserNotFoundError,
  ReviewValidationError,
} from "@/services/reviewErrors";
import { addReview } from "@/services/reviewService";
import { z } from "zod";

const ReviewSchema = z.object({
  rating: z.int().min(1).max(5),
  servingId: z.int(),
  comment: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ReviewSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const review = await addReview({
      rating: parsed.data.rating,
      servingId: parsed.data.servingId,
      comment: parsed.data.comment,
      tags: parsed.data.tags,
      userId: null,
    });

    return Response.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof ReviewServingNotFoundError) {
      return Response.json({ error: error.message }, { status: 404 });
    }

    if (
      error instanceof ReviewValidationError ||
      error instanceof ReviewUserNotFoundError
    ) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    console.error("Failed to create review", error);
    return Response.json({ error: "Failed to create review" }, { status: 500 });
  }
}
