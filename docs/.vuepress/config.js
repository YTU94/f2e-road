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
            },
            {
                title: "vue篇",
                path: "/page/page-vue/",
                collapsable: false, // 来让一个组永远都是展开状态
                sidebarDepth: 1,

            },
            {
                title: "计算机网络基础",
                path: "/page/page-network/"
            },
            {
                title: "算法和数据结构",
                path: "/page/page-algorithom/"
            },
            {
                title: "前段工程化",
                path: "/page/page-ngineering/"
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
