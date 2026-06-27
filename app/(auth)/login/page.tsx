import LoginForm from '@/components/loginForm';

export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: ' #232e30' 
    }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '15px' }}>
        <LoginForm />
      </div>
    </div>
  );
}