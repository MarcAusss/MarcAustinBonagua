import { Injectable } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postService: PostService, private http: HttpClient, private afAuth: AngularFireAuth, private authService: AuthService) { }

  //saving data from creating post
  saveData(post: Post){
    this.http.put(`https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data/${post.ownerId}.json`, post)
    .subscribe((res)=>{
      console.log(res);
      // https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data.json
    })
}

  //fetching data from firebase for viewing in home
  fetchData(){
    return this.http.get<Post[]>('https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data.json')
    .pipe(tap((listsOfPosts: Post[]) => {
        listsOfPosts = listsOfPosts.filter(post => post.ownerId === this.authService.userId); 
        console.log(listsOfPosts);
        this.postService.setPosts(listsOfPosts);
    })
    )
}
 
  //updating the data 
  updateData(index: number, updatedPost: Post) {
        this.postService.updatePost(index, updatedPost);
    this.http.put(`https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data/${index}.json`, updatedPost)
        .subscribe(response => {
            console.log(response);
        });
  }

  //deleting data from firebase
  deleteData(index: number){
    this.postService.deleteButton(index);
    this.http.delete(`https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data/${index}.json`)
        .subscribe(response => {
            console.log(response);
        });
}

  //comment push to firebase 
  addComment(index: number, comment: string) {
    const post = this.postService.getSpecPost(index);
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push(comment);
    this.http.put(`https://kahitano-4c56c-default-rtdb.asia-southeast1.firebasedatabase.app/data/${index}.json`, post)
      .subscribe(response => {
        console.log(response);
      });
}



}
