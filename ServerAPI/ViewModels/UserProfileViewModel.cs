public class UserProfileViewModel
{
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }

    public List<PostItemViewModel> UserPosts { get; set; } = new List<PostItemViewModel>();
    public List<PostItemViewModel> LikedPosts { get; set; } = new List<PostItemViewModel>();
}
