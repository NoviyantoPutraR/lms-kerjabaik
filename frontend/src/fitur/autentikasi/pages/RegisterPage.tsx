import { RegisterForm } from "../komponen/RegisterForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function RegisterPage() {
  return (
    <AuthLayout
      headerTitle="Buat Akun Baru"
      headerSubtitle="Mulai perjalanan belajar Anda hari ini"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
