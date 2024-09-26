//må fikses senere

public class FeedViewModel
{
    public List<PostItemViewModel> Posts { get; set; } = new List<PostItemViewModel>();
}

public class PostItemViewModel
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string AuthorName { get; set; }
    public int LikesCount { get; set; }
    public int CommentsCount { get; set; }
}
