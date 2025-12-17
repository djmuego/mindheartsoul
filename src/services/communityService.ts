
import { CommunityPost, Comment, Report, User } from '../types';
import { storage } from './storage';
import { PostListSchema, CommentListSchema } from '../schemas/community.schema';

const POSTS_KEY = 'mhs_posts_v1';
const COMMENTS_KEY = 'mhs_comments_v1';
const LIKES_KEY = 'mhs_post_likes_v1';
const REPORTS_KEY = 'mhs_reports_v1';

// --- Posts ---

export const getPosts = (): CommunityPost[] => {
  const posts = storage.getValidatedJSON<CommunityPost[]>(POSTS_KEY, PostListSchema, []);
  return posts.sort((a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime());
};

export const getPostById = (id: string): CommunityPost | undefined => {
  return getPosts().find(p => p.id === id);
};

export const createPost = (user: User, text: string, imageUrl?: string, language: string = 'en'): CommunityPost => {
  const posts = getPosts();
  const tags = text.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.replace('#', '')) || [];

  const newPost: CommunityPost = {
    id: Math.random().toString(36).substr(2, 9),
    authorId: user.id,
    authorName: user.name,
    authorAvatarUrl: user.avatarDataUrl,
    createdAtIso: new Date().toISOString(),
    text,
    imageUrl,
    language,
    tags,
    likeCount: 0,
    commentCount: 0
  };

  posts.push(newPost);
  storage.setJSON(POSTS_KEY, posts);
  return newPost;
};

// --- Comments ---

export const getComments = (postId: string): Comment[] => {
  const allComments = storage.getValidatedJSON<Comment[]>(COMMENTS_KEY, CommentListSchema, []);
  return allComments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(a.createdAtIso).getTime() - new Date(b.createdAtIso).getTime());
};

export const addComment = (postId: string, user: User, text: string): Comment => {
  const allComments = storage.getValidatedJSON<Comment[]>(COMMENTS_KEY, CommentListSchema, []);
  
  const newComment: Comment = {
    id: Math.random().toString(36).substr(2, 9),
    postId,
    authorId: user.id,
    authorName: user.name,
    authorAvatarUrl: user.avatarDataUrl,
    createdAtIso: new Date().toISOString(),
    text
  };

  allComments.push(newComment);
  storage.setJSON(COMMENTS_KEY, allComments);

  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex >= 0) {
    posts[postIndex].commentCount += 1;
    storage.setJSON(POSTS_KEY, posts);
  }

  return newComment;
};

// --- Likes ---

export const hasUserLiked = (postId: string, userId: string): boolean => {
  const likesMap = storage.getJSON<Record<string, string[]>>(LIKES_KEY, {});
  const postLikes = likesMap[postId] || [];
  return postLikes.includes(userId);
};

export const toggleLike = (postId: string, userId: string): number => {
  const likesMap = storage.getJSON<Record<string, string[]>>(LIKES_KEY, {});
  let postLikes = likesMap[postId] || [];
  const hasLiked = postLikes.includes(userId);

  if (hasLiked) {
    postLikes = postLikes.filter(id => id !== userId);
  } else {
    postLikes.push(userId);
  }

  likesMap[postId] = postLikes;
  storage.setJSON(LIKES_KEY, likesMap);

  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex >= 0) {
    posts[postIndex].likeCount = postLikes.length;
    storage.setJSON(POSTS_KEY, posts);
  }

  return postLikes.length;
};

// --- Reports ---

export const reportPost = (postId: string, reporterId: string, reason: Report['reason'], note?: string) => {
  const reports = storage.getJSON<Report[]>(REPORTS_KEY, []);
  const newReport: Report = {
    id: Math.random().toString(36).substr(2, 9),
    postId,
    reporterId,
    reason,
    note,
    createdAtIso: new Date().toISOString()
  };
  reports.push(newReport);
  storage.setJSON(REPORTS_KEY, reports);
};

// --- Seeding ---

export const seedCommunityIfEmpty = () => {
  const posts = getPosts();
  if (posts.length > 0) return;

  const seeds: CommunityPost[] = [
    {
      id: 'seed1',
      authorId: 'sys_sarah',
      authorName: 'Sarah Johnson',
      authorAvatarUrl: 'https://picsum.photos/seed/mentor1/200/200',
      createdAtIso: new Date(Date.now() - 3600000).toISOString(),
      text: 'Just finished an amazing meditation session. The clarity I feel today is unmatched! 🧘‍♀️✨ #Mindfulness #Peace',
      language: 'en',
      tags: ['Mindfulness', 'Peace'],
      likeCount: 24,
      commentCount: 2,
      imageUrl: 'https://picsum.photos/seed/meditation/500/300'
    },
    {
      id: 'seed2',
      authorId: 'sys_david',
      authorName: 'David Chen',
      authorAvatarUrl: 'https://picsum.photos/seed/mentor2/200/200',
      createdAtIso: new Date(Date.now() - 86400000).toISOString(),
      text: 'Mercury retrograde is finally over! Time to sign those contracts and move forward with big plans. 📜⭐ #Astrology #MercuryDirect',
      language: 'en',
      tags: ['Astrology', 'MercuryDirect'],
      likeCount: 45,
      commentCount: 5
    },
    {
      id: 'seed3',
      authorId: 'sys_elena',
      authorName: 'Elena Petrova',
      authorAvatarUrl: 'https://picsum.photos/seed/mentor3/200/200',
      createdAtIso: new Date(Date.now() - 172800000).toISOString(),
      text: 'Healing takes time. Be gentle with yourself today. ❤️',
      language: 'en',
      tags: ['Healing', 'SelfCare'],
      likeCount: 112,
      commentCount: 12
    }
  ];

  storage.setJSON(POSTS_KEY, seeds);
};
