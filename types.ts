
export interface User {
  id: string;
  email: string;
  name?: string; 
  selectedGenres?: string[]; // To store user's selected genres
}

export interface BlogEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  authorId: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  coverImage?: File | null; 
  coverImageName?: string; 
  coverImageUrl?: string; 
  likes?: number;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}