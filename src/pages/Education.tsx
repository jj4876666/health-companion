import { PageLayout } from "@/components/layout/PageLayout";
import { EnhancedEducationHub } from "@/components/education/EnhancedEducationHub";

const Education = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <EnhancedEducationHub />
      </div>
    </PageLayout>
  );
};

export default Education;
