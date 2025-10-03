"use client";

import { signOut } from "next-auth/react";

export function AccessDeniedPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div></div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Accès refusé
          </h1>
          <p className="text-sm text-muted-foreground">
            Vous n'êtes pas autorisé à accéder, veuillez appeler
            l'administrateur.
          </p>
        </div>
        {/*  logout button */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              signOut({
                callbackUrl: "/auth",
              });
            }}
            className="btn btn-primary"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export function NofacilityPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div></div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
          <h1 className="text-2xl font-semibold tracking-tight">
            Accès refusé
          </h1>
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas été assigné à aucun établissement, veuillez appeler
            l'administrateur.
          </p>
        </div>
        {/*  logout button */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              signOut({
                callbackUrl: "/auth",
              });
            }}
            className="btn btn-primary"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
