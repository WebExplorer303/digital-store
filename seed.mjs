import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyA7bnwC47PHHXdUDbNwVKZxosswcA8eEnU",
  authDomain: "digital-marketplace-6fe83.firebaseapp.com",
  projectId: "digital-marketplace-6fe83",
  storageBucket: "digital-marketplace-6fe83.firebasestorage.app",
  messagingSenderId: "992103558490",
  appId: "1:992103558490:web:543a0a9ba37e4a3dc81763",
  measurementId: "G-RB1DS62GQB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    "title": "Dashboard UI Kit",
    "description": "A comprehensive UI kit for building modern admin dashboards. Includes 50+ components including charts, tables, kanban boards, calendars, and data visualization widgets. Built with React and Tailwind CSS, fully responsive and dark mode ready.",
    "summary": "50+ React dashboard components with charts, tables, and dark mode support.",
    "price": 39.99,
    "category": "UI Kit",
    "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "SaaS Landing Page Template",
    "description": "A conversion-optimized landing page template for SaaS products. Includes hero section, features grid, pricing table, testimonials, FAQ accordion, and newsletter signup. Built with Next.js and Tailwind CSS.",
    "summary": "Next.js landing page template with pricing, testimonials, and FAQ sections.",
    "price": 29.99,
    "category": "Template",
    "imageUrl": "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Learn TypeScript in 30 Days",
    "description": "A structured 30-day guide to mastering TypeScript from scratch. Covers types, interfaces, generics, decorators, and advanced patterns with real-world examples. Includes 30 daily exercises, a capstone project, and cheat sheets.",
    "summary": "Structured 30-day TypeScript guide with exercises and real-world examples.",
    "price": 19.99,
    "category": "Course",
    "imageUrl": "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Mobile App UI Kit",
    "description": "A complete UI kit for designing iOS and Android mobile applications. Contains 200+ screens across 15 categories including onboarding, authentication, e-commerce, social feed, messaging, and settings. Available in Figma with auto-layout and variants.",
    "summary": "200+ mobile app screens in Figma with components for iOS and Android.",
    "price": 49.99,
    "category": "UI Kit",
    "imageUrl": "https://images.unsplash.com/photo-1512941937938-a372359e3db7?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "React Component Library Starter",
    "description": "A production-ready starter kit for building and publishing your own React component library. Includes Storybook setup, TypeScript configuration, Jest testing, rollup bundling, and npm publishing workflow. Comes with 20 pre-built base components.",
    "summary": "Starter kit for building and publishing React component libraries with Storybook.",
    "price": 34.99,
    "category": "Software",
    "imageUrl": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Figma Design System",
    "description": "A complete design system built in Figma with 300+ components, 10 color themes, typography scales, spacing tokens, and icon sets. Includes light and dark mode variants for every component. Built for teams shipping production products.",
    "summary": "300+ Figma components with color themes, typography, and dark mode.",
    "price": 59.99,
    "category": "UI Kit",
    "imageUrl": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Next.js SaaS Boilerplate",
    "description": "A full-stack SaaS starter with authentication, billing, dashboard, and team management pre-built. Includes Stripe integration, role-based access control, email notifications, and a polished admin panel. Ship your SaaS in days not months.",
    "summary": "Full-stack SaaS starter with auth, billing, and team management.",
    "price": 79.99,
    "category": "Template",
    "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Tailwind CSS Mastery Guide",
    "description": "A complete guide to mastering Tailwind CSS from beginner to advanced. Covers utility classes, custom themes, responsive design, animations, plugins, and building real-world UI components. Includes 15 project walkthroughs and a component cheat sheet.",
    "summary": "Complete Tailwind CSS guide with 15 projects and component cheat sheet.",
    "price": 17.99,
    "category": "Course",
    "imageUrl": "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "E-commerce Storefront Template",
    "description": "A production-ready e-commerce storefront built with Next.js, Tailwind CSS, and Stripe. Includes product listing, filtering, cart, checkout, and order confirmation pages. Fully responsive with a clean minimal design optimized for conversions.",
    "summary": "Next.js e-commerce template with cart, checkout, and Stripe integration.",
    "price": 44.99,
    "category": "Template",
    "imageUrl": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Node.js REST API Boilerplate",
    "description": "A scalable REST API boilerplate built with Node.js, Express, and TypeScript. Includes JWT authentication, role-based access control, rate limiting, input validation, error handling, and a full test suite with Jest. Docker-ready with CI/CD pipeline.",
    "summary": "Scalable Node.js API starter with auth, validation, and Docker support.",
    "price": 27.99,
    "category": "Software",
    "imageUrl": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "UI Animation Pack",
    "description": "A collection of 100+ smooth CSS and Framer Motion animations for React. Includes entrance animations, hover effects, loading states, transitions, and micro-interactions. Copy-paste ready with full TypeScript support and customizable parameters.",
    "summary": "100+ CSS and Framer Motion animations for React with copy-paste code.",
    "price": 22.99,
    "category": "UI Kit",
    "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  },
  {
    "title": "Learn Python in 30 Days",
    "description": "A beginner-friendly 30-day Python programming course with real-world projects. Covers variables, data structures, functions, OOP, file handling, APIs, and web scraping. Includes daily challenges, a final capstone project, and a reference handbook.",
    "summary": "Beginner to intermediate Python course with projects and daily challenges.",
    "price": 14.99,
    "category": "Course",
    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
    "downloadUrl": "",
    "sellerId": "jYB72XAexLOorOi051lD2L3fdly1",
    "ownedBy": [
      "jYB72XAexLOorOi051lD2L3fdly1"
    ]
  }
];

for (const product of products) {
  await addDoc(collection(db, "products"), product);
  console.log("Added:", product.title);
}