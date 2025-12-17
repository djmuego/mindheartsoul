
import { z } from 'zod';

export const CommunityPostSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorAvatarUrl: z.string().optional(),
  createdAtIso: z.string(),
  text: z.string(),
  imageUrl: z.string().optional(),
  language: z.string(),
  tags: z.array(z.string()).optional(),
  likeCount: z.number(),
  commentCount: z.number(),
});

export const CommentSchema = z.object({
  id: z.string(),
  postId: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorAvatarUrl: z.string().optional(),
  createdAtIso: z.string(),
  text: z.string(),
});

export const PostListSchema = z.array(CommunityPostSchema);
export const CommentListSchema = z.array(CommentSchema);
