import { LoginForm } from "../komponen/LoginForm";
import { AuthLayout } from "../layouts/AuthLayout";

export function LoginPage() {
  return (
    <AuthLayout
      headerTitle="Selamat Datang Kembali"
      headerSubtitle="Masuk ke akun Anda untuk melanjutkan belajar"
    >
      <LoginForm />
    </AuthLayout>
  );
}
