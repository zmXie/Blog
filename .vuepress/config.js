module.exports = {
  "title": "大大盆子",
  "description": "日常记录",
  "dest": "public",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  "base": '/',
  "theme": "reco",
  "themeConfig": {
    "nav": [{
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [{
          "text": "GitHub",
          "link": "https://github.com/zmXie?tab=repositories",
        },
        {
          "text": "简书",
          "link": "https://www.jianshu.com/u/03e9c9f9a30f",
        }]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "friendLink": [{
        "title": "vuepress-theme-reco",
        "desc": "A simple and beautiful vuepress Blog & Doc theme.",
        "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
        "link": "https://vuepress-theme-reco.recoluan.com"
      },
      {
        "title": "午后南杂",
        "desc": "Enjoy when you can, and endure when you must.",
        "email": "1156743527@qq.com",
        "link": "https://www.recoluan.com"
      },
      {
        "title": "前端小课",
        "desc": "前端知识小集",
        "link": "https://lefex.gitee.io/books/"
      },
      {
        "title": "匠心博客",
        "desc": "知名博客集合",
        "link": "https://zhaomenghuan.js.org/nav/"
      }
    ],
    "logo": "/avatar.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "author": "xzm",
    "authorAvatar": "/avatar.png",
    "startYear": "2022"
  },
  "markdown": {
    "lineNumbers": true
  }
}