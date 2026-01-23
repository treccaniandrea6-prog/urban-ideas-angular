import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';

type CommentForm = { name: string; email: string; body: string };
type NewPostForm = { user_id: number | null; title: string; body: string };

@Component({
  standalone: true,
  selector: 'app-posts',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './posts.html',
})
export class PostsComponent implements OnInit {
  // Posts list
  posts: any[] = [];
  loading = false;
  error = '';
  page = 1;
  perPage = 10;

  // Search
  query = '';

  // Comments (per postId)
  commentsOpen: Record<number, boolean> = {};
  commentsLoading: Record<number, boolean> = {};
  commentsError: Record<number, string> = {};
  commentsByPost: Record<number, any[]> = {};

  // Add comment (per postId)
  commentForm: Record<number, CommentForm> = {};
  commentSending: Record<number, boolean> = {};
  commentSendError: Record<number, string> = {};
  commentSendOk: Record<number, boolean> = {};

  // New post
  newPost: NewPostForm = { user_id: null, title: '', body: '' };
  creatingPost = false;
  createPostError = '';
  createPostOk = false;

  constructor(
    private postsService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts(1);
  }

  private ensureCommentForm(postId: number): void {
    const id = Number(postId);
    if (!id) return;

    if (!this.commentForm[id]) {
      this.commentForm[id] = { name: '', email: '', body: '' };
    }
    if (this.commentSending[id] === undefined) this.commentSending[id] = false;
    if (this.commentSendOk[id] === undefined) this.commentSendOk[id] = false;
    if (!this.commentSendError[id]) this.commentSendError[id] = '';
  }

  private resetCreatePostFlags(): void {
    this.createPostOk = false;
    this.createPostError = '';
  }

  loadPosts(page: number): void {
    const safePage = Math.max(1, Number(page) || 1);

    this.page = safePage;
    this.loading = true;
    this.error = '';

    // pulizia feedback UI
    this.resetCreatePostFlags();

    this.postsService.getAllPosts(this.page, this.perPage).subscribe({
      next: (data: any[]) => {
        this.posts = data ?? [];
        this.loading = false;

        // init per-post comment forms
        for (const p of this.posts) {
          const postId = Number(p?.id);
          if (!postId) continue;
          this.ensureCommentForm(postId);
        }
      },
      error: (err: any) => {
        this.loading = false;
        const status = err?.status;
        if (status === 401) this.error = 'Unauthorized. Please sign in again.';
        else this.error = 'Error loading posts.';
      },
    });
  }

  nextPage(): void {
    if (this.loading) return;
    this.loadPosts(this.page + 1);
  }

  prevPage(): void {
    if (this.loading || this.page <= 1) return;
    this.loadPosts(this.page - 1);
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  goUsers(): void {
    this.router.navigateByUrl('/users');
  }

  // ---- SEARCH (client-side) ----
  get filteredPosts(): any[] {
    const q = (this.query || '').trim().toLowerCase();
    if (!q) return this.posts;

    return this.posts.filter((p) => {
      const t = String(p?.title ?? '').toLowerCase();
      const b = String(p?.body ?? '').toLowerCase();
      return t.includes(q) || b.includes(q);
    });
  }

  // ---- COMMENTS ----
  toggleComments(postId: number): void {
    const id = Number(postId);
    if (!id) return;

    this.ensureCommentForm(id);

    const nextOpen = !this.commentsOpen[id];
    this.commentsOpen[id] = nextOpen;

    // reset feedback when toggling
    this.commentSendOk[id] = false;
    this.commentSendError[id] = '';

    if (nextOpen && !this.commentsByPost[id]) {
      this.loadComments(id);
    }
  }

  loadComments(postId: number): void {
    const id = Number(postId);
    if (!id) return;

    this.ensureCommentForm(id);

    this.commentsLoading[id] = true;
    this.commentsError[id] = '';
    this.commentSendOk[id] = false;

    this.postsService.getCommentsByPost(id).subscribe({
      next: (data: any[]) => {
        this.commentsByPost[id] = data ?? [];
        this.commentsLoading[id] = false;
      },
      error: (err: any) => {
        this.commentsLoading[id] = false;
        const status = err?.status;
        if (status === 401) this.commentsError[id] = 'Unauthorized. Please sign in again.';
        else this.commentsError[id] = 'Error loading comments.';
      },
    });
  }

  sendComment(postId: number): void {
    const id = Number(postId);
    if (!id) return;

    this.ensureCommentForm(id);

    const form = this.commentForm[id];
    const name = (form.name || '').trim();
    const email = (form.email || '').trim();
    const body = (form.body || '').trim();

    this.commentSendError[id] = '';
    this.commentSendOk[id] = false;

    if (!name || !email || !body) {
      this.commentSendError[id] = 'Please fill in name, email and comment.';
      return;
    }

    this.commentSending[id] = true;

    this.postsService.createComment(id, { name, email, body }).subscribe({
      next: () => {
        this.commentSending[id] = false;
        this.commentSendOk[id] = true;

        // keep name/email, clear body
        this.commentForm[id] = { ...form, body: '' };

        // reload comments to show the new one
        this.loadComments(id);
      },
      error: (err: any) => {
        this.commentSending[id] = false;
        const status = err?.status;
        if (status === 401) this.commentSendError[id] = 'Unauthorized. Please sign in again.';
        else if (status === 422) this.commentSendError[id] = 'Invalid data (check email).';
        else this.commentSendError[id] = 'Error sending comment.';
      },
    });
  }

  // ---- CREATE POST ----
  createPost(): void {
    this.createPostError = '';
    this.createPostOk = false;

    const user_id = Number(this.newPost.user_id);
    const title = (this.newPost.title || '').trim();
    const body = (this.newPost.body || '').trim();

    if (!user_id || Number.isNaN(user_id)) {
      this.createPostError = 'User ID is required.';
      return;
    }
    if (!title || !body) {
      this.createPostError = 'Title and body are required.';
      return;
    }

    this.creatingPost = true;

    this.postsService.createPost({ user_id, title, body }).subscribe({
      next: () => {
        this.creatingPost = false;
        this.createPostOk = true;

        this.newPost = { user_id: this.newPost.user_id, title: '', body: '' };

        // reload current page
        this.loadPosts(this.page);
      },
      error: (err: any) => {
        this.creatingPost = false;
        const status = err?.status;
        if (status === 401) this.createPostError = 'Unauthorized. Please sign in again.';
        else if (status === 422) this.createPostError = 'Invalid data (check user_id/title/body).';
        else this.createPostError = 'Error creating post.';
      },
    });
  }
}