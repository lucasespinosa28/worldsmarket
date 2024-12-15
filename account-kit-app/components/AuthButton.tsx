import Button from "@/app/components/Button";
import { useAuthModal, useLogout, useSignerStatus, useUser } from "@account-kit/react";

export function AuthButton() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();

  if (signerStatus.isInitializing) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <p className="text-xl font-bold">Success!</p>
        <p>Logged in as {user.email ?? "anon"}.</p>
        {/* <Button disabled={false} color="red" onClick={() => logout()}>
          Log out
        </Button> */}
      </div>
    );
  }

  return (
    <Button disabled={false} color="blue" onClick={openAuthModal}>
      Login
    </Button>
  );
}