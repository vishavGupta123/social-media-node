{let e=function(){$("#new-post-form").submit((function(e){e.preventDefault();var o=new FormData;console.log(document.getElementById("content").value),console.log(document.getElementById("file").files[0]),o.append("content",document.getElementById("content").value),o.append("postImage",document.getElementById("file").files[0]),$.ajax({type:"post",url:"/posts/create",data:o,contentType:!1,processData:!1,success:function(e){console.log(e);let o=t(e.data.post,e.data.user);$("#posts-list-container>ul").prepend(o),$("#new-post-form").val(),n($(" .delete-post-button",o)),new PostComments(e.data.post._id),new ToggleLike($(" .toggle-like-button",o)),new Noty({theme:"relax",text:"Post published!",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))},t=function(e,t){return $(`<li id="post-${e._id}">\n       <img src=" ${e.postImage} " class="image-style" alt="post image" width="300px" height="200px" />\n            <small>\n                <a class="delete-post-button"  href="/posts/destroy/${e._id}">X</a>\n            </small>\n       \n        <div>${e.content}</div>\n        <small>${e.user.name}</small>\n        <br>\n        <small>\n            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Post" >\n                0 Likes\n            </a>\n        </small>\n        <div class="post-comments">\n            \n                <form action="/comments/create" method="POST">\n                    <input type="text" name="content" placeholder="Type here to add comment...">\n                    <input type="hidden" name="post" value="${e._id} ">\n                    <input type="submit" value="Add Comment">\n                </form>\n\n            <div class="post-comments-list">\n                <ul id="post-comments-${e._id}">\n\n                </ul>\n            </div>\n        </div>\n    </li>`)},n=function(e){$(e).click((function(t){t.preventDefault(),$.ajax({type:"get",url:$(e).prop("href"),success:function(e){console.log(e),$("#post-"+e.data.post_id).remove(),new Noty({theme:"relax",text:"Post deleted",type:"success",layout:"topRight",timeout:1500}).show()},error:function(e){console.log(e.responseText)}})}))},o=function(){$("#posts-list-container>ul>li").each((function(){let e=$(this),t=$(" .delete-post-button",e);n(t),console.log(e);let o=e.prop("id").split("-")[1];console.log(o),new PostComments(o)}))};e(),o()}