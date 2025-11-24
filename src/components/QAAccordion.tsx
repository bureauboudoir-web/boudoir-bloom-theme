import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const qaData = [
  {
    question: "Do I need experience to join?",
    answer: "No — we focus on potential, not past experience. Whether you're completely new or have been creating content for years, our system is designed to meet you where you are and guide you to the next level."
  },
  {
    question: "Do I stay in control of my accounts?",
    answer: "Always. You own everything. We guide the strategy, build the brand, and manage the marketing — but your accounts, your content, and your identity remain 100% yours."
  },
  {
    question: "Do I need to live in Amsterdam?",
    answer: "No — remote creators are welcome. While our studio is based in Amsterdam's historic centre, we work with creators from around the world. Studio shoots can be arranged when you visit, or we can coordinate content creation remotely."
  },
  {
    question: "What do you do for creators?",
    answer: "We build your brand, persona, storyline, content plan, scripts, funnels, and growth systems. Think of us as your creative director, marketing team, and business strategist — all working together to transform your online presence into something unforgettable."
  },
  {
    question: "How safe is this?",
    answer: "Your boundaries, privacy, and identity come first. We never push you beyond your comfort zone. Everything is discussed and agreed upon before any content is created. Your safety and well-being are non-negotiable."
  },
  {
    question: "How much content is required weekly?",
    answer: "Typically 10–20 photos and 2–4 clips per week. Your dashboard shows everything clearly, and we work together to create a schedule that fits your life. Consistency matters, but so does quality — we'll never sacrifice one for the other."
  },
  {
    question: "What makes BB different?",
    answer: "We don't outsource or use templates — we build creators into characters the world wants to follow. Every brand is handcrafted, every strategy is personalized, and every creator receives the kind of attention typically reserved for celebrities and high-end talent."
  },
  {
    question: "How fast can I start?",
    answer: "Usually within 48–72 hours after your application is approved. We'll schedule an onboarding call, begin building your persona and brand map, and start planning your first content immediately."
  }
];

const QAAccordion = () => {
  return (
    <div className="w-full py-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-rose-gold">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about working with Bureau Boudoir.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-6">
          {qaData.map((qa, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border-2 border-rose-gold/30 rounded-xl bg-card px-8 hover:border-rose-gold transition-all hover:shadow-lg"
            >
              <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:text-rose-gold hover:no-underline py-6">
                {qa.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                {qa.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default QAAccordion;
