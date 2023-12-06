import { EventEmitter, Injectable } from '@angular/core';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor( private http: HttpClient, private authService: AuthService ) { }

  listChangeEvent: EventEmitter<Post[]> = new EventEmitter();
    listofPosts: Post[]=[
        // new Post("Tech Crunch", "https://www.allthingsdogs.com/wp-content/uploads/2019/10/Long-Haired-Dachshund-What-To-Know-About-This-Stunning-Dachshund-Cover.jpg",
        // "California is the world’s breadbasket, which means we collect, transport and store as much water as possible. About 12% of the energy produced in the state is used to pump water."
        // , "Cidddd", new Date(), 6)
    ];

    getPost(){
        return this.listofPosts;
    }
    deleteButton(index: number){
        this.listofPosts.splice(index, 1);
    }

    addPost(post: Post){
    post.ownerId = this.authService.userId; 
    this.listofPosts.push(post);
    }

    updatePost(index: number, post: Post ){
        this.listofPosts[index] = post;
    }
    getSpecPost(index: number){
        return this.listofPosts[index];
    }
    likePost(index: number){
        this.listofPosts[index].numberOfLikes++;
        this.listChangeEvent.emit(this.listofPosts);
    }
    
    addComment(index: number, comment: string) {
        if (!this.listofPosts[index].comments) {
            this.listofPosts[index].comments = [];
        }
        this.listofPosts[index].comments.push(comment);
    }

    setPosts(listsOfPosts:Post[]){
        this.listofPosts = listsOfPosts;
        this.listChangeEvent.emit(listsOfPosts);   
       }
    
}
