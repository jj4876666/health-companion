import { PageLayout } from "@/components/layout/PageLayout";
import { EducationHub } from "@/components/education/EducationHub";

const Education = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <EducationHub />
      </div>
    </PageLayout>
  );
};

export default Education;
