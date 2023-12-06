import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})

export class PostEditComponent {
  //identifiers
  form!: FormGroup;
  index: number = 0;
  editMode = false;
  
  constructor(private postService:PostService, private route: Router, 
    private actRoute: ActivatedRoute, private backEndService: BackEndService,
    private authService: AuthService){}

  ngOnInit(): void{

    // identifier for parameters
let editTitle = "";
let editDescription = "";
let editImgPath = "";

      this.actRoute.params.subscribe((params: Params) => {
         if(params['index']){
          console.log(params['index']);
          this.index = params['index'];
         
          const post = this.postService.getSpecPost(this.index);

          editTitle = post.title;
          editDescription = post.description;
          editImgPath = post.imgPath;
          
          this.editMode = true;

        }
      }
      );

    this.form = new FormGroup({
      title: new FormControl(editTitle, [Validators.required]),
      imgPath: new FormControl(editImgPath, [Validators.required]),
      description: new FormControl(editDescription, [Validators.required])
     })
    }

  //submit function  
  async onsubmit(){
    const title = this.form.value.title;
    const imgPath = this.form.value.imgPath;
    const description = this.form.value.description;
    const ownerId = (await this.authService.getUserId()) || 'defaultOwnerId';
    const userEmail = (await this.authService.getUserEmail()) || 'default@email.com';
  
    const post: Post = new Post(
      title, imgPath, description, new Date(), 0, [], ownerId, userEmail
    );
  
    if(this.editMode == true) {
      this.postService.updatePost(this.index, post);
      this.backEndService.updateData(this.index, post);
    } else {
      this.postService.addPost(post);
      this.backEndService.saveData(post);
    }
  
    this.route.navigate(['post-list']);
  }

}
