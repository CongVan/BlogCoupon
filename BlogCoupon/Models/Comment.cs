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
    
    public partial class Comment
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Content { get; set; }
        public Nullable<int> Level { get; set; }
        public Nullable<System.DateTime> CDate { get; set; }
        public Nullable<int> CommentTo { get; set; }
        public string Web { get; set; }
        public string Email { get; set; }
        public Nullable<int> PostID { get; set; }
        public Nullable<int> Flag { get; set; }
    }
}
