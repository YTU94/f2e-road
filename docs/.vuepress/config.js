module.exports = {
    title: "前端之道",
    description: "Just playing around",

    themeConfig: {
        displayAllHeaders: true,
        sidebar: "auto",
        sidebar: [
            ["/guide/", "介绍"],
            {
                title: "JS篇",
                path: "/js-page/",
                collapsable: false, // 来让一个组永远都是展开状态
                sidebarDepth: 1,
                children: [
                    {
                        title: "js基础",
                        path: "/js-page/base.html"
                    },
                    {
                        title: "js——原型篇",
                        path: "/js-page/prototype.html"
                    }
                ]
            },
            {
                title: "计算机基础",
                path: "/page/page-a/"
            }
        ],
        nav: [
            { text: "介绍", link: "/guide/" },
            { text: "Github", link: "https://google.com" },
            {
                text: "Languages",
                ariaLabel: "Language Menu",
                items: [
                    { text: "Chinese", link: "/language/chinese/" },
                    { text: "English", link: "/language/English/" }
                ]
            }
        ]
    },
    configureWebpack: {
        resolve: {
            alias: {
                "@alias": "path/to/some/dir"
            }
        }
    },
    plugins: ["@vuepress/back-to-top"]
}
