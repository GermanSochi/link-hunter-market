// AI-маркет категории.
// Изображения временно ссылаются на существующие placeholder в /public/nav/,
// чтобы шаблон не падал. Заменить при готовности финальных иллюстраций.
export const PRODUCT_CATEGORIES = [
  {
    label: "Дом",
    value: "home" as const,
    featured: [
      {
        name: "Лучшее для быта",
        href: "/products?category=home",
        imageSrc: "/nav/ui-kits/mixed.jpg",
      },
      {
        name: "Новинки",
        href: "/products?category=home&sort=new",
        imageSrc: "/nav/ui-kits/blue.jpg",
      },
      {
        name: "Хиты продаж",
        href: "/products?category=home&sort=top",
        imageSrc: "/nav/ui-kits/purple.jpg",
      },
    ],
  },
  {
    label: "Работа",
    value: "work" as const,
    featured: [
      {
        name: "AI-помощники для бизнеса",
        href: "/products?category=work",
        imageSrc: "/nav/ui-kits/gradient-ui-ux-landing-page.jpg",
      },
      {
        name: "Автоматизация задач",
        href: "/products?category=work&sort=new",
        imageSrc: "/nav/ui-kits/gradient-ui-kit-collection_23.jpg",
      },
      {
        name: "Тексты и копирайтинг",
        href: "/products?category=work&sort=top",
        imageSrc: "/nav/ui-kits/gradient-colored-ui-kit-pack_23.jpg",
      },
    ],
  },
  {
    label: "Учёба",
    value: "study" as const,
    featured: [
      {
        name: "Подготовка к экзаменам",
        href: "/products?category=study",
        imageSrc: "/nav/ui-kits/gradient-dark-mode-app-template.jpg",
      },
      {
        name: "Изучение языков",
        href: "/products?category=study&sort=new",
        imageSrc: "/nav/ui-kits/gradient-ui-ux-elements_23.jpg",
      },
      {
        name: "Школа и университет",
        href: "/products?category=study&sort=top",
        imageSrc: "/nav/ui-kits/barber-shop-booking.jpg",
      },
    ],
  },
  {
    label: "Хобби",
    value: "hobby" as const,
    featured: [
      {
        name: "Творчество и арт",
        href: "/products?category=hobby",
        imageSrc: "/nav/icons/picks.jpg",
      },
      {
        name: "Музыка и звук",
        href: "/products?category=hobby&sort=new",
        imageSrc: "/nav/icons/new.jpg",
      },
      {
        name: "Развлечения",
        href: "/products?category=hobby&sort=top",
        imageSrc: "/nav/icons/bestsellers.jpg",
      },
    ],
  },
] as const;

export type ProductCategoryValue = (typeof PRODUCT_CATEGORIES)[number]["value"];
