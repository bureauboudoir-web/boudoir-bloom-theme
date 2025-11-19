import { Check, X } from "lucide-react";

const comparisonData = [
  {
    feature: "Personalized Brand & Identity",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Professional Studio Shoots",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Content Direction & Styling",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Marketing Strategy & Scripts",
    bureauBoudoir: true,
    otherAgencies: true,
    goingSolo: false
  },
  {
    feature: "Sales Funnels & PPV Strategy",
    bureauBoudoir: true,
    otherAgencies: true,
    goingSolo: false
  },
  {
    feature: "Personal Rep & Support",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Weekly Growth Planning",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Boundaries & Privacy Respected",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: true
  },
  {
    feature: "You Own Your Accounts",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: true
  },
  {
    feature: "Amsterdam-Inspired Aesthetic",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  },
  {
    feature: "Chat Team Management",
    bureauBoudoir: true,
    otherAgencies: true,
    goingSolo: false
  },
  {
    feature: "High-Ticket Retention Systems",
    bureauBoudoir: true,
    otherAgencies: false,
    goingSolo: false
  }
];

const ComparisonTable = () => {
  return (
    <div className="w-full py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-serif text-5xl mb-4 text-rose-gold">How Bureau Boudoir Compares</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See exactly what sets us apart from typical agencies and going it alone.
          </p>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto border-collapse">
            <thead>
              <tr className="border-b-2 border-rose-gold">
                <th className="text-left py-4 px-6 font-serif text-xl text-foreground">Feature</th>
                <th className="text-center py-4 px-6 font-serif text-xl text-rose-gold">Bureau Boudoir</th>
                <th className="text-center py-4 px-6 font-serif text-xl text-muted-foreground">Other Agencies</th>
                <th className="text-center py-4 px-6 font-serif text-xl text-muted-foreground">Going Solo</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-border hover:bg-accent/5 transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-accent/3'
                  }`}
                >
                  <td className="py-4 px-6 text-foreground">{row.feature}</td>
                  <td className="text-center py-4 px-6">
                    {row.bureauBoudoir ? (
                      <Check className="w-6 h-6 text-rose-gold mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-destructive/60 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-4 px-6">
                    {row.otherAgencies ? (
                      <Check className="w-6 h-6 text-muted-foreground/50 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-destructive/60 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-4 px-6">
                    {row.goingSolo ? (
                      <Check className="w-6 h-6 text-muted-foreground/50 mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-destructive/60 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-6">
          {comparisonData.map((row, index) => (
            <div key={index} className="border border-border rounded-lg p-4 bg-card">
              <h3 className="font-semibold text-lg mb-3 text-foreground">{row.feature}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-rose-gold font-medium">Bureau Boudoir</span>
                  {row.bureauBoudoir ? (
                    <Check className="w-5 h-5 text-rose-gold" />
                  ) : (
                    <X className="w-5 h-5 text-destructive/60" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Other Agencies</span>
                  {row.otherAgencies ? (
                    <Check className="w-5 h-5 text-muted-foreground/50" />
                  ) : (
                    <X className="w-5 h-5 text-destructive/60" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Going Solo</span>
                  {row.goingSolo ? (
                    <Check className="w-5 h-5 text-muted-foreground/50" />
                  ) : (
                    <X className="w-5 h-5 text-destructive/60" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
