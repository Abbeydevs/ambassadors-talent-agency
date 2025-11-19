import { RegisterForm } from "@/components/auth/register-form";

const EmployerRegisterPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[#F9FAFB] py-12">
      <RegisterForm role="EMPLOYER" />
    </div>
  );
};

export default EmployerRegisterPage;
