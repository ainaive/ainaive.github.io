/**
 * Every string the site renders, in both languages. `en` defines the shape;
 * `zh` is typed against it, so a missing translation is a compile error.
 * Voice rules live in docs/CONTENT.md — honest, plain, a little wry.
 */

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

const en = {
  meta: {
    title: "AI Naive — small software, honestly made",
    description:
      "The storefront of AI Naive: an ordinary developer, coding with AI, quietly making small things that are more fun than useful.",
    ogLocale: "en_US",
  },
  skipLink: "Skip to content",
  langToggle: {
    label: "Language",
    ariaCurrent: "current language",
  },
  hero: {
    tagline: "small software, honestly made",
    wordmarkAria: "AI Naive",
    manifesto:
      "AI Naive is “AI Native” with the T — the Technology — fallen out. It isn’t a typo; it’s a stance. None of Big Tech’s Technology, no grand narrative, no pitch deck. Just an ordinary developer, coding with AI, quietly making small things that are useless but fun.",
  },
  shelf: {
    heading: "The shelf",
    lede: "Not all of it is useful, but all of it is fun: built with AI, polished by hand, waiting for someone with your taste to find it.",
    colophon: "More in the works.",
  },
  status: {
    live: "Live",
    soon: "Coming soon",
    v0: "v0 · early",
  },
  appLinks: {
    live: "Visit",
    github: "Source",
  },
  appTile: {
    more: "More",
    less: "Less",
    detailsAria: "details",
  },
  about: {
    heading: "About",
    body: [
      "AI Naive is the workshop label of [hutusi](https://hutusi.com) — making things that are useless but fun.",
      "Every app on the shelf was built in close collaboration with AI coding tools, then tested, documented, and maintained like it matters — because it does. More is on the way.",
    ],
  },
  footer: {
    line: "Useless, and therefore useful.",
    sealAria: "AI Naive seal",
    links: {
      github: "GitHub",
      blog: "hutusi.com",
    },
  },
  notFound: {
    title: "Page not found — AI Naive",
    heading: "404",
    message: "This page fell out, like the T.",
    backHome: "Back to the shelf",
  },
} as const satisfies UiShape;

const zh = {
  meta: {
    title: "AI Naive —— 小软件，认真做",
    description:
      "AI Naive 的作品陈列室：一个普通开发者，借助 AI 编程，安安静静地做出一些无用而有趣的东西。",
    ogLocale: "zh_CN",
  },
  skipLink: "跳到正文",
  langToggle: {
    label: "语言",
    ariaCurrent: "当前语言",
  },
  hero: {
    tagline: "小软件，认真做",
    wordmarkAria: "AI Naive",
    manifesto:
      "AI Naive，不是 AI Native，少了 T —— 代表 Technology 的 T。没有大公司的那种 Technology，也不会讲宏大叙事，不会做路演幻灯片，只是一个普通开发者，借助 AI 编程，安安静静地做出一些无用而有趣的东西。",
  },
  shelf: {
    heading: "架上",
    lede: "这里的软件不一定有用，但一定有趣：借助 AI 构建，迭代打磨，等待与你有同样品味的人的发现。",
    colophon: "更多在路上。",
  },
  status: {
    live: "已上线",
    soon: "即将发布",
    v0: "v0 · 早期",
  },
  appLinks: {
    live: "访问",
    github: "源码",
  },
  appTile: {
    more: "展开",
    less: "收起",
    detailsAria: "详情",
  },
  about: {
    heading: "关于",
    body: [
      "AI Naive 是 [hutusi](https://hutusi.com) 的工坊标签 —— 做无用而有趣的东西。",
      "架上的每一个应用，都是与 AI 编程工具深度协作的产物，然后像正经软件一样测试、写文档、长期维护 —— 因为它们本来就是正经软件。更多作品，正在路上。",
    ],
  },
  footer: {
    line: "无用之用，方为大用。",
    sealAria: "AI Naive 印章",
    links: {
      github: "GitHub",
      blog: "hutusi.com",
    },
  },
  notFound: {
    title: "页面不存在 —— AI Naive",
    heading: "404",
    message: "这一页掉了，就像那个 T。",
    backHome: "回到架上",
  },
} as const satisfies UiShape;

/** The shape both languages must satisfy — structure fixed, wording free. */
type UiShape = {
  meta: { title: string; description: string; ogLocale: string };
  skipLink: string;
  langToggle: { label: string; ariaCurrent: string };
  hero: { tagline: string; wordmarkAria: string; manifesto: string };
  shelf: { heading: string; lede: string; colophon: string };
  status: { live: string; soon: string; v0: string };
  appLinks: { live: string; github: string };
  appTile: { more: string; less: string; detailsAria: string };
  about: { heading: string; body: readonly string[] };
  footer: {
    line: string;
    sealAria: string;
    links: { github: string; blog: string };
  };
  notFound: {
    title: string;
    heading: string;
    message: string;
    backHome: string;
  };
};

export const ui: Record<Locale, UiShape> = { en, zh };

/** Site-wide constants that don't vary by locale. */
export const site = {
  url: "https://ainaive.com",
  name: "AI Naive",
  author: {
    github: "https://github.com/hutusi",
    blog: "https://hutusi.com",
  },
} as const;

/** Path prefix for a locale: '' for en, '/zh' for zh. */
export const localePath = (locale: Locale): string =>
  locale === "en" ? "" : "/zh";
