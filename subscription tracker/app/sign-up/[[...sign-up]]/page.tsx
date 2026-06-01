import SignUpPage from "../../../components/navigation/navigation";
import { ClerkProvider } from '@clerk/nextjs'


export default function SignUp() {
    return (
        <ClerkProvider>
            <SignUpPage />
        </ClerkProvider>
    )
}
