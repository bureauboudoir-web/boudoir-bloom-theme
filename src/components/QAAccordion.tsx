import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QAAccordion = () => {
  const { t } = useTranslation();
  
  const qaKeys = ['experience', 'control', 'location', 'services', 'safety', 'contentReq', 'different', 'start'];
  
  return (
    <div className="w-full py-20 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-primary">{t('faq.title')}</h2>
          <p className="text-lg text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-6">
          {qaKeys.map((key, index) => (
            <AccordionItem 
              key={key} 
              value={`item-${index}`}
              className="border-2 border-primary/40 rounded-xl bg-card px-8 hover:border-rose-gold transition-all hover:shadow-lg"
            >
              <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:text-primary hover:no-underline py-6">
                {t(`faq.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                {t(`faq.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default QAAccordion;
