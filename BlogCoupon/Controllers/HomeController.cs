using BlogCoupon.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BlogCoupon.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            using (var ctx = new BlogCouponEntities())
            {
                var posthost = ctx.Posts.Where(c => c.Flag == 1).OrderByDescending(c => c.CreateDate).ToList();

                return View(posthost);
            }
        }

        public ActionResult Menu()
        {
            using (var ctx = new BlogCouponEntities())
            {

                var lst = ctx.Categories.Where(c => c.ParentID == null).OrderBy(c => c.ID).ToList();
                for (int i = 0; i < lst.Count; i++)
                {
                    int id = lst[i].ID;
                    var child = ctx.Categories.Where(c => c.ParentID == id).ToList();
                    if (child.Count > 0)
                    {
                        lst[i].HasChild = true;
                    }
                    else
                    {
                        lst[i].HasChild = false;
                    }
                }
                return PartialView(lst);
            }
        }
        public ActionResult MenuChild(int id)
        {
            using (var ctx = new BlogCouponEntities())
            {

                var lst = ctx.Categories.Where(c => c.ParentID == id).OrderByDescending(c => c.ID).ToList();
                return PartialView(lst);
            }
        }
        public ActionResult ListPost(int type = 1)
        {
            //type=1 postnew
            //type=2 
            using (var ctx = new BlogCouponEntities())
            {
                var postnew = ctx.Posts.Where(c => c.Flag == 1).OrderByDescending(c => c.CreateDate).Take(6).ToList();
                return PartialView(postnew);
            }



        }
        public ActionResult RenderPage(string slug)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var post = ctx.Posts.Where(c => c.Slug == slug).FirstOrDefault();
                if (post == null)
                {
                    ViewBag.NotFound = "Không tìm thấy dữ liệu";
                    return View();
                }
                var coupons = ctx.Coupons.Where(c => c.PostID == post.ID).ToList();

                var Comments = ctx.Comments.Where(c => c.Level == 1 && c.PostID == post.ID).ToList();

                ViewBag.Coupons = coupons;
                ViewBag.Comments = Comments;
                return View(post);
            }

        }
        public void GetCommentChild(int commentID, int postID)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var commentChild = ctx.Comments.Where(c => c.CommentTo == commentID && c.PostID == postID).ToList();
                Session["CommentChild"] = commentChild;
            }
        }
        public ActionResult CateSlugPage(string slug)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var cate = ctx.Categories.Where(c => c.Slug == slug).FirstOrDefault();
                if (cate == null)
                {
                    ViewBag.NotFound = "Không tìm thấy dữ liệu";
                    return View();
                }
                var posts = ctx.Posts.Where(c => c.CategoryID == cate.ID).ToList();
                return View(posts);
            }
        }
        public ActionResult TestPage()
        {
            return View();
        }
        public ActionResult TestRenderPage()
        {
            return View();
        }
        public ActionResult Partner()
        {
            return View();
        }
        [HttpPost]
        public ActionResult ProcessComment(string postid, string relyto, string level, string name, string email, string web, string content)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var comment = new Comment();
                comment.CDate = DateTime.Now;
                comment.CommentTo = int.Parse(relyto);
                comment.Level = int.Parse(level);
                comment.Name = name;
                comment.PostID = int.Parse(postid);
                comment.Web = web;
                comment.Content = content;
                comment.Flag = 0;
                try
                {
                    ctx.Comments.Add(comment);
                    ctx.SaveChanges();
                    return Json("1", JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json(ex.Message, JsonRequestBehavior.AllowGet);
                }

            }

        }
        public int CheckCommentChild(int? id,int post)
        {
            if (id.HasValue == false)
            {
                return 0;
            }
            using (var ctx = new BlogCouponEntities())
            {
                var comment = ctx.Comments.Where(c => c.CommentTo == id.Value && c.PostID==post).ToList();
                return comment.Count;
            }
        }
        public ActionResult GetMoreComment(int id,int postid)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var comment = ctx.Comments.Where(c => c.CommentTo == id && c.PostID == postid).ToList();
                return Json(comment, JsonRequestBehavior.AllowGet); 
            }
        }
    }
}