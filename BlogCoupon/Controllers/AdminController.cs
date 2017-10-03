using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BlogCoupon.Models;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Globalization;

namespace BlogCoupon.Controllers
{
    public class AdminController : Controller
    {
        public List<Dictionary<string, object>> GetTableRows(DataTable dtData)
        {
            List<Dictionary<string, object>>
            lstRows = new List<Dictionary<string, object>>();
            Dictionary<string, object> dictRow = null;

            foreach (DataRow dr in dtData.Rows)
            {
                dictRow = new Dictionary<string, object>();
                foreach (DataColumn col in dtData.Columns)
                {
                    dictRow.Add(col.ColumnName, dr[col]);
                }
                lstRows.Add(dictRow);
            }
            return lstRows;
        }
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }

        #region Categories
        // GET: Admin/Categories
        public ActionResult Categories()
        {
            return View();

        }

        public ActionResult Gallery()
        {
            return View();

        }
        public ActionResult GetCbbCategories()
        {
            using (var ctx = new BlogCouponEntities())
            {
                //List<Category> lst = new List<Category>() { new Category() { ID = 0, Name = "Không" } };
                var lst = ctx.Categories.Where(c => c.GroupName == null).ToList();
                var result = new List<Category>();
                foreach (var item in lst)
                {
                    result.Add(item);
                    var child = ctx.Categories.Where(c => c.ParentID == item.ID).ToList();
                    if (child != null)
                    {
                        result.AddRange(child);
                    }

                }

                return Json(result, JsonRequestBehavior.AllowGet);
            }

        }
        // GET: Admin/GetCategories
        public ActionResult GetCategories()
        {
            using (var ctx = new BlogCouponEntities())
            {

                return Json(ctx.Categories.ToList(), JsonRequestBehavior.AllowGet);
            }

        }
        [HttpPost]
        public int DeleteCategories(int? ID)
        {
            if (!ID.HasValue)
            {
                return 0;
            }
            using (var ctx = new BlogCouponEntities())
            {
                var cate = ctx.Categories.Where(c => c.ID == ID).FirstOrDefault();
                if (cate == null)
                {
                    return 0;
                }
                ctx.Categories.Remove(cate);
                var lstChild = ctx.Categories.Where(c => c.ParentID == ID).ToList();
                if (lstChild != null)
                {
                    ctx.Categories.RemoveRange(lstChild);
                }

                ctx.SaveChanges();
                return 1;
            }

        }

        [HttpPost]
        public int UpdateCategories(int? ID, string Name,string Slug)
        {
            if (!ID.HasValue)
            {
                return 0;
            }
            using (var ctx = new BlogCouponEntities())
            {
                var cate = ctx.Categories.Where(c => c.ID == ID).FirstOrDefault();
                if (cate == null)
                {
                    return 0;
                }
                cate.Name = Name;
                cate.Slug = Slug;
                ctx.Entry(cate).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
                return 1;
            }

        }

        [HttpPost]
        public int AddCategories(string ParentID, string Name,string Slug)
        {

            using (var ctx = new BlogCouponEntities())
            {
                Category cate = new Category();
                cate.Name = Name;
                cate.Slug = Slug;
                if (!String.IsNullOrEmpty(ParentID))
                {

                    cate.ParentID = int.Parse(ParentID);
                    
                    var group = ctx.Categories.Where(c => c.ID == cate.ParentID).FirstOrDefault();
                    cate.GroupName = group.Name;
                }
                try
                {
                    ctx.Categories.Add(cate);
                    ctx.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {

                    return 0;
                }


            }

        }
        #endregion


        public ActionResult AddPost()
        {
            ViewBag.AddSuccess = TempData["AddSuccess"] != null ? TempData["AddSuccess"] : null;
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult AddPost(FormCollection frm)
        {
            using (var ctx = new BlogCouponEntities())
            {
                var post = new Post();
                post.Title = frm["Title"].ToString();
                string slug = frm["Slug"].ToString();
                string intro = frm["Intro"].ToString();

                var checkSlug = ctx.Posts.Where(c => c.Slug == slug).FirstOrDefault();


                post.Slug = frm["Slug"].ToString();
                post.Content = frm["Content"].ToString();
                post.CategoryID = int.Parse(frm["CategoryID"].ToString());
                post.Tag = frm["Tag"].ToString();
                post.CreateDate = DateTime.Now;
                post.Flag = 1;
                post.Intro = intro;
                ctx.Posts.Add(post);
                ctx.SaveChanges();
                if (checkSlug != null)
                {
                    post.Slug = post.Slug + "-" + post.ID;

                }
                ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
            TempData["AddSuccess"] = "Đăng bài thành công!";
            return RedirectToAction("AddPost", "Admin");
        }

        public ActionResult GetAllPosts()
        {
            return View();
        }
        public ActionResult GetPost(int? id)
        {
            if (!id.HasValue)
                return Json(null, JsonRequestBehavior.AllowGet);
            using (var ctx = new BlogCouponEntities())
            {
                var post = ctx.Posts.Where(c => c.ID == id).FirstOrDefault();
                return Json(post, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPost]
        public ActionResult GetAllPosts(FormCollection frm)
        {


            return View();
        }
        public ActionResult GetListPosts()
        {

            using (var ctx = new BlogCouponEntities())
            {

                //  var ret = ctx.Database.SqlQuery<object>("SELECT p.*,c.Name 'CateName' FROM Posts p LEFT JOIN Categories c ON p.CategoryID=c.ID").ToDictionary<string,object>();

                DataTable ds = new DataTable();
                using (SqlConnection connection = new SqlConnection(ctx.Database.Connection.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("SELECT p.*,c.Name 'CateName' FROM Posts p LEFT JOIN Categories c ON p.CategoryID=c.ID WHERE p.Flag=1", connection))
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(ds);
                    }
                }
                var lst = GetTableRows(ds);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetListPostsCombobox()
        {

            using (var ctx = new BlogCouponEntities())
            {
                DataTable ds = new DataTable();
                using (SqlConnection connection = new SqlConnection(ctx.Database.Connection.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("SELECT p.ID,P.Title FROM Posts p WHERE p.Flag=1 ", connection))
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(ds);
                    }
                }
                var lst = GetTableRows(ds);
                return Json(lst, JsonRequestBehavior.AllowGet);
                // return Json(ctx.Posts.Where(c => c.Flag == 1).ToList(), JsonRequestBehavior.AllowGet);
            }
        }
        public int DeleteBlog(int? ID)
        {
            if (!ID.HasValue)
            {
                return 0;
            }
            using (var ctx = new BlogCouponEntities())
            {
                var post = ctx.Posts.Where(c => c.ID == ID).FirstOrDefault();
                if (post == null)
                {
                    return 0;
                }
                post.Flag = 0;
                ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
                return 1;
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public int PUpdatePost(string id, string title, string slug, string cate, string tag, string content,string Intro)
        {

            using (var ctx = new BlogCouponEntities())
            {
                int idP = 0;
                if (int.TryParse(id, out idP) == false)
                {
                    return 0;
                }
                var post = ctx.Posts.Where(c => c.ID == idP).FirstOrDefault();
                if (post == null)
                {
                    return 0;
                }
                post.Title = title;
                post.Slug = slug;
                post.Update = DateTime.Now;
                post.Tag = tag;
                post.CategoryID = int.Parse(cate);
                post.Content = content;
                post.Intro = Intro;
                var checkSlug = ctx.Posts.Where(c => c.Slug == slug).FirstOrDefault();
                ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
                //if (checkSlug != null)
                //{
                //    post.Slug = post.Slug + "-" + post.ID;
                //}
                //ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                //ctx.SaveChanges();
                return 1;
            }
        }

        public int PUpdateImage(List<Dictionary<string, string>> lst)
        {
            using (var ctx = new BlogCouponEntities())
            {
                foreach (var item in lst)
                {
                    int id = int.Parse(item["ID"].ToString());
                    string url = item["Url"].ToString();

                    var post = ctx.Posts.Where(c => c.ID == id).FirstOrDefault();
                    if (post == null || post.ImgThumb == url)
                    {
                        continue;
                    }
                    post.ImgThumb = url;
                    ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                }
                try
                {
                    ctx.SaveChanges();
                    return 1;
                }
                catch (Exception)
                {
                    return -1;

                }

            }
        }
        #region Coupons
        public ActionResult AddCoupon()
        {
            ViewBag.AddSuccess = TempData["AddSuccess"] != null ? TempData["AddSuccess"] : null;
            return View();
        }
        [HttpPost]
        public ActionResult AddCoupon(FormCollection frm)
        {

            using (var ctx = new BlogCouponEntities())
            {
                int tmp = 0;
                var coupon = new Coupon();
                coupon.Title = frm["Title"].ToString();
                //coupon.Cate = int.TryParse(frm["Cate"].ToString(),out tmp)?tmp:0;
                coupon.PostID = int.TryParse(frm["Cate"].ToString(), out tmp) ? tmp : 0;
                coupon.Branch = frm["Branch"].ToString();
                coupon.Note = frm["Note"].ToString();
                coupon.SellOff = int.TryParse(frm["Percent"].ToString(), out tmp) ? tmp : 0;
                coupon.Type = int.Parse(frm["Type"].ToString());


                coupon.Code = frm["Code"].ToString();

                coupon.Link = frm["Link"].ToString();

                //DateTime tmpDate;
                //coupon.DateEnd = DateTime.TryParse(frm["DateEnd"].ToString(), null, System.Globalization.DateTimeStyles.AssumeUniversal, out tmpDate) == true ? tmpDate : DateTime.Today;
                string[] temp = frm["DateEnd"].ToString().Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);
                coupon.DateEnd = temp.Length == 0 ? DateTime.Now : new DateTime(int.Parse(temp[2]), int.Parse(temp[1]), int.Parse(temp[0]));
                ctx.Coupons.Add(coupon);
                ctx.SaveChanges();
            }
            TempData["AddSuccess"] = "Đăng Coupon thành công!";
            return Redirect("/Admin/AddCoupon");
        }
        public ActionResult Coupons()
        {
            return View();
        }
        public ActionResult GetListCoupon()
        {

            using (var ctx = new BlogCouponEntities())
            {

                //  var ret = ctx.Database.SqlQuery<object>("SELECT p.*,c.Name 'CateName' FROM Posts p LEFT JOIN Categories c ON p.CategoryID=c.ID").ToDictionary<string,object>();

                DataTable ds = new DataTable();
                using (SqlConnection connection = new SqlConnection(ctx.Database.Connection.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("SELECT p.*,CASE WHEN p.Type=1 THEN N'Mã giảm giá' ELSE 'Link Aff' END as 'TypeName',c.Title 'PostName' " +
                        "FROM Coupons p LEFT JOIN Posts c ON p.PostID=c.ID ", connection))
                    {
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(ds);
                    }
                }
                var lst = GetTableRows(ds);
                return Json(lst, JsonRequestBehavior.AllowGet);
            }
        }

        public int DeleteCoupon(int? ID)
        {
            if (!ID.HasValue)
            {
                return 0;
            }
            using (var ctx = new BlogCouponEntities())
            {
                var post = ctx.Coupons.Where(c => c.ID == ID).FirstOrDefault();
                if (post == null)
                {
                    return 0;
                }
                ctx.Coupons.Remove(post);
                //post.Flag = 0;
                //ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
                return 1;
            }
        }
        public ActionResult GetCoupon(int? id)
        {
            if (!id.HasValue)
                return Json(null, JsonRequestBehavior.AllowGet);
            using (var ctx = new BlogCouponEntities())
            {
                var post = ctx.Coupons.Where(c => c.ID == id).FirstOrDefault();
                return Json(post, JsonRequestBehavior.AllowGet);

            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public int PUpdateCoupon(int IDCoupon, string Title, string PostID, string Link, string Branch,
                    string Type, string DateEnd, string Code, string Note, string Percent)
        {

            using (var ctx = new BlogCouponEntities())
            {
                int tmp = 0;
                var coupon = ctx.Coupons.Where(c => c.ID == IDCoupon).FirstOrDefault();
                if (coupon == null)
                {
                    return 0;
                }

                coupon.Title = Title;
                //coupon.Cate = int.TryParse(frm["Cate"].ToString(),out tmp)?tmp:0;
                coupon.PostID = int.TryParse(PostID, out tmp) ? tmp : 0;
                coupon.Branch = Branch;
                coupon.Note = Note;
                coupon.SellOff = int.TryParse(Percent, out tmp) ? tmp : 0;
                coupon.Type = int.Parse(Type);

                coupon.Code = Code;
                coupon.Link = Link;

                string[] temp = DateEnd.Split(new string[] { "/" }, StringSplitOptions.RemoveEmptyEntries);


                coupon.DateEnd = temp.Length == 0 ? DateTime.Now : new DateTime(int.Parse(temp[2]), int.Parse(temp[1]), int.Parse(temp[0]));
                ctx.Entry(coupon).State = System.Data.Entity.EntityState.Modified;
                ctx.SaveChanges();
            }
            return 1;
        }
        public ActionResult UpdateImage()
        {
            return View();
        }
        #endregion
    }
}