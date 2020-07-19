module.exports = {
    title: "前端之道",
    description: "Just playing around",
    themeConfig: {
        displayAllHeaders: true,
        sidebar: "auto",
        sidebar: [
            ["/guide/", "介绍"],
            {
                title: "计算机网络基础",
                path: "/page/page-network/",
                children: [
                    {
                        title: "网络知识基础",
                        path: "/page/page-network/network-base.md"
                    }
                ]
            },
            {
                title: "网络基础",
                path: "/page/brower-page/",
                children: [
                    {
                        title: "网络知识基础",
                        path: "/page/brower-page/network-request.md"
                    },
                    {
                        title: "原型",
                        path: "/page/brower-page/prototype.md"
                    },
                    {
                        title: "进程和线程",
                        path: "/page/brower-page/side.md"
                    }
                ]
            },
            {
                title: "vue篇",
                path: "/page/page-vue/",
                children: [
                    {
                        title: "文件结构&&Vue构造函数",
                        path: "/page/page-vue/file-structure.md"
                    },
                    {
                        title: "响应式数据",
                        path: "/page/page-vue/observer-state"
                    },
                    {
                        title: "响应式",
                        path: "/page/page-vue/observer"
                    }
                ]
            }
            // {
            //     title: "算法和数据结构",
            //     path: "/page/page-algorithom/"
            // },
            // {
            //     title: "前段工程化",
            //     path: "/page/page-ngineering/"
            // }
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
    base: "/",
    markdown: {
        lineNumbers: true
    },
    plugins: ["@vuepress/back-to-top"]
}
