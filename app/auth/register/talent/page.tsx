import { RegisterForm } from "@/components/auth/register-form";

const TalentRegisterPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[#F9FAFB] py-12">
      <RegisterForm role="TALENT" />
    </div>
  );
};

export default TalentRegisterPage;
