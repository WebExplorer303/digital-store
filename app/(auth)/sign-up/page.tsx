import SignupForm from '@/components/signUp';

export default function SignupPage() {
  return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#f4f6f8' 
        }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '15px' }}>
            <SignupForm />
            
          </div>
        </div>
  );
}