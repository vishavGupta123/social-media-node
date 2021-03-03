class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();

            let self = this;
            console.log(self);
            $.ajax({
                type:'POST',
                url:$(self).attr('href'),
            })
            .done(function(data){
                console.log(data);
                let likesCount = parseInt($(self).attr('data-likes'));
                console.log(likesCount);
                if(data.data.deleted == true){
                    likesCount-=1;
                }
                else{
                    likesCount+=1;
                }

                $(self).attr('data-likes',likesCount);
                $(self).html(`${likesCount} Likes`);
                if(data.data.deleted == false){
                  $(self).prepend('<img src="https://www.flaticon.com/svg/vstatic/svg/1216/1216649.svg?token=exp=1614447010~hmac=bae0ede71970c589f4b6713d07130732" width="10px" height="10px" />')
                }
                else if(data.data.deleted == true){
                    $(self).remove('<img/>')
                }
                
            })
            .fail(function(errData){
                console.log('error in completing the request');
            })
        })
    }
}