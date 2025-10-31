// WordPress fallback data for GeNeGo website
// This file is no longer used for data fetching - see API routes in app/api/wordpress/
// Keeping for reference only

// Note: WordPress integration is now handled through:
// - API Routes: app/api/wordpress/home/route.ts and app/api/wordpress/pages/[slug]/route.ts
// - Client-side fetching: Pages use SWR to fetch from these API routes
// - Environment variable: WORDPRESS_API_URL should point to your WordPress REST API

export const siteData = {
  heroSlides: [
    {
      id: 1,
      image: "/modern-sustainable-housing-development-with-green-.jpg",
      title: "Start 1. Etappe",
      description:
        "Das Wohnprojekt der Genossenschaft Neumühle Goldach steht in den Startlöchern. Die Baueingabe für die erste Etappe der altersdurchmischten Siedlung mit attraktiven Gemeinschaftsflächen erfolgt im Sommer 2025.",
    },
    {
      id: 2,
      image: "/community-garden-with-people-in-cooperative-housin.jpg",
      title: "Gemeinsam Wohnen",
      description:
        "Ein Lebensort, der mehr ist als Wohnen. Der komplette Kreislauf des Lebens mit all seinen Facetten soll in diesem Quartier Platz haben.",
    },
  ],
  content: {
    title: "Gemeinsam Wohnen, Gemeinsam Gestalten",
    paragraphs: [
      "Das Projekt einer altersdurchmischten Siedlung der Genossenschaft Neumühle Goldach (GeNeGo) ist aus dem Bedürfnis nach einem Lebensort entstanden, der mehr ist als Wohnen. Der komplette Kreislauf des Lebens mit all seinen Facetten soll in diesem Quartier Platz haben. Es bietet Wohnqualität für Menschen, die ein Leben in der Gemeinschaft suchen, die gerne ihren Beitrag für das Zusammenleben leisten und ihr Leben selbstbestimmt gestalten möchten. Hier sind sie eingebettet in ein grösseres Ganzes und finden gleichzeitig genügend Rückzugsmöglichkeiten und Freiraum für sich selbst.",
      "Nebst dem Aspekt des Sozialraums stellt sich die GeNeGo damit den weiteren Herausforderungen unserer Zeit. Im Wissen, dass Bauen und Wohnen nachhaltig sein müssen, werden Boden, Energie und Infrastruktur ressourcenschonend genutzt. Und durch die nicht gewinnorientierte Rechtsform der Genossenschaft bleibt das Geld im Projekt und wird der Spekulation entzogen.",
    ],
  },
}
