"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserProfile() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <Card className="w-full">
        <CardContent className="text-center p-6">
          <p className="mb-4">You are not logged in.</p>
          <Button 
            onClick={() => router.push("/login")} 
            className="w-full"
          >
            Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { user } = session;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "User"} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Email verified:</span>
          <span>{user.emailVerified ? "Yes" : "No"}</span>
        </div>
        {user.createdAt && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Account created:</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="w-full"
        >
          Sign out
        </Button>
      </CardFooter>
    </Card>
  );
} 