import { PageContainer } from "@/components/PageContainer";
import { useTranslation } from "react-i18next";

const Terms = () => {
  const { t } = useTranslation();
  
  return (
    <PageContainer>
      
      <section className="pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-serif text-5xl font-bold text-primary mb-8 text-glow-red">
            {t('terms.title')}
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground">
            <p className="text-xl text-muted-foreground mb-8">
              {t('terms.lastUpdated')}
            </p>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.agreement.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.agreement.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.services.title')}</h2>
              <p className="text-muted-foreground mb-4">
                {t('terms.services.intro')}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('terms.services.item1')}</li>
                <li>{t('terms.services.item2')}</li>
                <li>{t('terms.services.item3')}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.privacy.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.privacy.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.payment.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.payment.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.ownership.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.ownership.content')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold mb-4">{t('terms.contactSection.title')}</h2>
              <p className="text-muted-foreground">
                {t('terms.contactSection.content')}{" "}
                <a href={`mailto:${t('terms.contactSection.email')}`} className="text-primary hover:underline">
                  {t('terms.contactSection.email')}
                </a>
              </p>
            </section>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Terms;
