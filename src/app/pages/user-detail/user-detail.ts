import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UsersService } from '../../services/users.service';

type CommentFormModel = {
  name: string;
  email: string;
  body: string;
};

@Component({
  standalone: true,
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.html',
})
export class UserDetailComponent implements OnInit {
  userId = 0;

  // user
  loading = false;
  error = '';
  user: any = null;

  // posts (nomi coerenti con il template)
  posts: any[] = [];
  postsLoading = false;
  postsError = '';

  // comments
  commentsOpen: Record<number, boolean> = {};
  commentsLoading: Record<number, boolean> = {};
  commentsError: Record<number, string> = {};
  commentsByPost: Record<number, any[]> = {};

  // ✅ il template sta usando commentForm + sendComment + flags
  commentForm: Record<number, CommentFormModel> = {};
  commentSending: Record<number, boolean> = {};
  commentSendOk: Record<number, boolean> = {};
  commentSendError: Record<number, string> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.userId = Number(idParam) || 0;

    if (!this.userId) {
      this.error = 'Invalid user id';
      return;
    }

    this.loadUser();
    this.loadPosts();
  }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  }

  private loadUser(): void {
    this.loading = true;
    this.error = '';

    this.usersService.getUserById(this.userId).subscribe({
      next: (data: any) => {
        this.user = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        const status = err?.status;
        if (status === 401) this.error = 'Unauthorized. Please sign in again.';
        else this.error = 'Error loading user details.';
      },
    });
  }

  private loadPosts(force: boolean = false): void {
    this.postsLoading = true;
    this.postsError = '';

    this.usersService.getUserPosts(this.userId).subscribe({
      next: (data: any[]) => {
        this.posts = data ?? [];
        this.postsLoading = false;

        // init states per ogni post
        for (const p of this.posts) {
          const postId = Number(p?.id) || 0;
          if (!postId) continue;

          if (this.commentsOpen[postId] === undefined) this.commentsOpen[postId] = false;
          if (!this.commentForm[postId]) {
            this.commentForm[postId] = { name: '', email: '', body: '' };
          }
          if (this.commentSending[postId] === undefined) this.commentSending[postId] = false;
          if (this.commentSendOk[postId] === undefined) this.commentSendOk[postId] = false;
          if (!this.commentSendError[postId]) this.commentSendError[postId] = '';
        }
      },
      error: (err: any) => {
        this.postsLoading = false;
        const status = err?.status;
        if (status === 401) this.postsError = 'Unauthorized. Please sign in again.';
        else this.postsError = 'Error loading posts.';
      },
    });
  }

  // ✅ usato dal template
  refreshPosts(): void {
    this.loadPosts(true);
  }

  // ✅ usato dal template
  toggleComments(postId: number): void {
    const id = Number(postId) || 0;
    if (!id) return;

    const next = !this.commentsOpen[id];
    this.commentsOpen[id] = next;

    if (next && !this.commentsByPost[id]) {
      this.loadComments(id);
    }
  }

  private loadComments(postId: number): void {
    const id = Number(postId) || 0;
    if (!id) return;

    this.commentsLoading[id] = true;
    this.commentsError[id] = '';

    const headers = this.getHeaders();

    this.http
      .get<any[]>(`https://gorest.co.in/public/v2/posts/${id}/comments`, { headers })
      .subscribe({
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

  // ✅ NOME CHE IL TEMPLATE SI ASPETTA
  sendComment(postId: number): void {
    const id = Number(postId) || 0;
    if (!id) return;

    const form = this.commentForm[id] || { name: '', email: '', body: '' };
    const name = (form.name || '').trim();
    const email = (form.email || '').trim();
    const body = (form.body || '').trim();

    // reset feedback
    this.commentSendOk[id] = false;
    this.commentSendError[id] = '';

    if (!name || !email || !body) {
      this.commentSendError[id] = 'Name, email and comment are required.';
      return;
    }

    this.commentSending[id] = true;

    const headers = this.getHeaders();

    this.http
      .post<any>(
        `https://gorest.co.in/public/v2/posts/${id}/comments`,
        { name, email, body },
        { headers }
      )
      .subscribe({
        next: () => {
          this.commentSending[id] = false;
          this.commentSendOk[id] = true;

          // pulisco form
          this.commentForm[id] = { name: '', email: '', body: '' };

          // ricarico commenti
          this.loadComments(id);
        },
        error: (err: any) => {
          this.commentSending[id] = false;

          const status = err?.status;
          if (status === 401) this.commentSendError[id] = 'Unauthorized. Please sign in again.';
          else if (status === 422) this.commentSendError[id] = 'Invalid data (check email format).';
          else this.commentSendError[id] = 'Error sending comment.';
        },
      });
  }

  // navigation (se presenti nel template)
  backToUsers(): void {
    this.router.navigateByUrl('/users');
  }

  goPosts(): void {
    this.router.navigateByUrl('/posts');
  }
}