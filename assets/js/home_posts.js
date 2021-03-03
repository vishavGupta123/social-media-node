{
    let createPost = function(){
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function(e){
            e.preventDefault();
            var formData = new FormData();
            console.log(document.getElementById('content').value);
            console.log(document.getElementById('file').files[0]);
            formData.append('content',document.getElementById('content').value);
            formData.append('postImage',document.getElementById('file').files[0]);
            $.ajax({
                type:'post',
                url:'/posts/create',
                data:formData,
                contentType:false,
                processData:false,
                success:function(data){
                    console.log(data);
                    let newPost = newPostDom(data.data.post,data.data.user);
                    $('#posts-list-container>ul').prepend(
                        newPost
                    );
                    $('#new-post-form').val();
                    deletePost($(' .delete-post-button',newPost));
                    new PostComments(data.data.post._id);
                    new ToggleLike($(' .toggle-like-button',newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error:function(error){
                    console.log(error.responseText);
                }
            })
        });
    }
    //method to create a post in DOM

    let newPostDom = function(post,user){
        return $(`<li id="post-${post._id}">
       <img src=" ${post.postImage} " class="image-style" alt="post image" width="300px" height="200px" />
            <small>
                <a class="delete-post-button"  href="/posts/destroy/${post._id}">X</a>
            </small>
       
        <div>${post.content}</div>
        <small>${ post.user.name }</small>
        <br>
        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post" >
                0 Likes
            </a>
        </small>
        <div class="post-comments">
            
                <form action="/comments/create" method="POST">
                    <input type="text" name="content" placeholder="Type here to add comment...">
                    <input type="hidden" name="post" value="${post._id} ">
                    <input type="submit" value="Add Comment">
                </form>

            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">

                </ul>
            </div>
        </div>
    </li>`)
    }

    //method to delete a post from dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type:'get',
                url:$(deleteLink).prop('href'),
                success:function(data){
                    console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme:'relax',
                        text:'Post deleted',
                        type:'success',
                        layout:'topRight',
                        timeout:1500
                    }).show();
                },error:function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    let sendPostIdToComments = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button',self);
            deletePost(deleteButton);
            console.log(self);
            let postId = self.prop('id').split("-")[1];
            console.log(postId);
            new PostComments(postId);
        })
    }


    createPost();
    sendPostIdToComments()

}