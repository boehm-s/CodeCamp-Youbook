var turn = function(str){
    str = str.replace(/@(\S*)/g, function(x){return "<a href='/#/user/"+x+"'>"+x+"</a>"});
    str = str.replace(/ #(\S*)/g, function(x){return "<a href='/#/hashtag/"+x.substr(2, x.length)+"'>"+x.substr(1, x.length)+"</a>"});
    return str;
}


