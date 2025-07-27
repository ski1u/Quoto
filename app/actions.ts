"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Provider } from "@supabase/supabase-js";

import { onboarding_questions_schema } from "@/data/onboarding-questions-data";
import { z } from "zod";

export const onboardAction = async (data: z.infer<typeof onboarding_questions_schema>) => {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  const { error } = await supabase.from("profiles").update({
    ...data,
    has_onboarded: true
  }).match({ id: user?.id })

  if (error || userError) return encodedRedirect("error", "/main/onboarding", "Error while onboarding");

  redirect("/main")
}

export const signUpAction = async (formData: { email: string, password: string }) => {
  const { email, password } = formData

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: { email: string, password: string }) => {
  const { email, password } = formData
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return encodedRedirect("error", "/sign-in", error.message);
  
  return redirect("/main");
};

export async function signInWithOAuthAction(provider: Provider, redirectRoute: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {redirectTo: redirectRoute}
  })
  if (error) {throw new Error(error.message); redirect("/sign-in")}

  redirect(data.url)
}

export const forgotPasswordAction = async (formData: { email: string, callbackUrl: string }) => {
  const { email, callbackUrl } = formData

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
