import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedPremiumSection } from "@/components/premium/EnhancedPremiumSection";

const Premium = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <EnhancedPremiumSection />
      </div>
    </PageLayout>
  );
};

export default Premium;
