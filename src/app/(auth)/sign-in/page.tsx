import { Suspense } from "react";
import Container from "@/components/Container";
import SignIn from "@/components/SignIn";

export default function SignInPage() {
  return (
    <Container>
      <Suspense fallback={null}>
        <SignIn />
      </Suspense>
    </Container>
  );
}
