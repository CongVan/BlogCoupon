//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BlogCoupon.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Post
    {
        public int ID { get; set; }
        public string CreateUser { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public Nullable<System.DateTime> Update { get; set; }
        public string Content { get; set; }
        public Nullable<int> CategoryID { get; set; }
        public string Slug { get; set; }
        public string Tag { get; set; }
        public string Title { get; set; }
        public Nullable<int> Flag { get; set; }
        public string ImgThumb { get; set; }
        public string Intro { get; set; }
    }
}
