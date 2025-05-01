export type Testimonial = {
  quote: string
  name: string
  position: string
  image: string // Path to profile image (like /images/testimonial1.jpg)
  rating: number // 1-5 stars
}

export const testimonials: Testimonial[] = [
  {
    quote: "Working with Vito was a game changer for our online business.",
    name: "Sarah Watson",
    position: "Chief Product Officer at PinkNews",
    image: "/images/testimonials/sarah-watson.jpg",
    rating: 5,
  },
  {
    quote: "Incredible attention to detail and an amazing final result.",
    name: "Jon Walter",
    position: "Lead Developer at PinkNews",
    image: "/images/testimonials/jon-walter.jpg",
    rating: 5,
  },
  {
    quote: "Our site speed and user experience improved drastically!",
    name: "Sam Dean",
    position: "Chief Architect at PinkNews",
    image: "/images/testimonials/sam-dean.jpg",
    rating: 4,
  },
]
