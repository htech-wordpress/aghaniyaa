
export interface Testimonial {
    id: number;
    name: string;
    role: string;
    rating: number;
    text: string;
    avatar: string;
}

export const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Rajesh Kumar",
        role: "Business Owner",
        rating: 5,
        text: "I was in need of INR 20 lakh for my business expansion. The process was incredibly smooth and the disbursal was quick. Highly recommended!",
        avatar: "/Assets/avatar-1.png"
    },
    {
        id: 2,
        name: "Priya Sharma",
        role: "Software Engineer",
        rating: 5,
        text: "Getting a home loan was always a daunting task for me, but AGHANIYA ENTERPRISES made it simple. The team guided me through every step.",
        avatar: "/Assets/avatar-2.png"
    },
    {
        id: 3,
        name: "Vikram Singh",
        role: "Entrepreneur",
        rating: 5,
        text: "I wanted quick fund disbursal and applied for a personal loan. The interest rates were competitive and the service was excellent.",
        avatar: "/Assets/avatar-3.png"
    },
    {
        id: 4,
        name: "Sneha Patel",
        role: "Doctor",
        rating: 5,
        text: "The team at AGHANIYA ENTERPRISES is very professional. They helped me compare multiple offers and choose the best one for my car loan.",
        avatar: "/Assets/avatar-4.png"
    },
    {
        id: 5,
        name: "Amit Verma",
        role: "Freelancer",
        rating: 5,
        text: "Excellent service! I got my credit card approved within days. The rewards program they suggested fits my lifestyle perfectly.",
        avatar: "/Assets/avatar-1.png"
    },
    {
        id: 6,
        name: "Anjali Gupta",
        role: "Teacher",
        rating: 5,
        text: "Transparent process and helpful support staff. I took an education loan for my son, and they made the paperwork hassle-free.",
        avatar: "/Assets/avatar-2.png"
    }
];
