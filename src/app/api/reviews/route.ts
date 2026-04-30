import { z } from "zod";
import { addReview } from "@/services/reviewService";

const ReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    lunchId: z.number(),
    userId: z.number().optional(),
    comment: z.string().optional(),
});

export async function POST(request: Request) {
    const body = await request.json();
    const parsed = ReviewSchema.safeParse(body);

    if (!parsed.success) {
        return Response.json({ error: parsed.error.flatten()}, {status: 400});
    }

    const review = await addReview(
        parsed.data.rating,
        parsed.data.lunchId,
        parsed.data.userId,
        parsed.data.comment,
    );

    return Response.json(review);
}