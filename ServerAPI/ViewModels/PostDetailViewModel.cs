//må fikses senere
public class PostDetailViewModel
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string AuthorName { get; set; }
    public int LikesCount { get; set; }

    public List<CommentViewModel> Comments { get; set; } = new List<CommentViewModel>();
    public List<UserLikeViewModel> Likes { get; set; } = new List<UserLikeViewModel>();
}

public class CommentViewModel
{
    public string CommenterName { get; set; }
    public string Text { get; set; }
}

public class UserLikeViewModel
{
    public string UserName { get; set; }
}
