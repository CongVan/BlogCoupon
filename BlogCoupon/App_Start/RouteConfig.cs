using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace BlogCoupon
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(name: "PageBySlug",
                        url: "{slug}",
                        defaults: new { controller = "Home", action = "RenderPage" },
                        constraints: new { slug = ".+" });
            routes.MapRoute(name: "CateBySlug",
                        url: "{slug}",
                        defaults: new { controller = "Home", action = "CateSlugPage" },
                        constraints: new { slug = ".+" });
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
