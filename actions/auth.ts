"use server";

import { createClient } from "@supabase/supabase-js";

export async function bootstrapAdminUser(email: string, password: string) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes("placeholder.supabase.co")) {
    return {
      success: true,
      mode: "demo",
      message: "Running in local demo mode without active Supabase project.",
    };
  }

  if (serviceRoleKey) {
    try {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // Try creating user with auto email confirmation
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: "Admin",
          role: "admin",
        },
      });

      if (error) {
        // If user already exists, update their password so they can log in
        if (
          error.message.toLowerCase().includes("already") ||
          error.message.toLowerCase().includes("exists") ||
          error.message.toLowerCase().includes("registered")
        ) {
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const target = usersData?.users.find(
            (u) => u.email?.toLowerCase() === email.toLowerCase()
          );

          if (target) {
            await supabaseAdmin.auth.admin.updateUserById(target.id, {
              password,
              email_confirm: true,
            });

            // Upsert profile
            await supabaseAdmin.from("profiles").upsert({
              id: target.id,
              email: target.email,
              full_name: "Admin",
              business_name: "Vasavi Events",
              role: "admin",
            });

            return {
              success: true,
              message: "Admin password updated and confirmed in Supabase! Logging you in...",
            };
          }
        }

        return { success: false, message: error.message };
      }

      // Upsert profile for new user
      if (data?.user) {
        await supabaseAdmin.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: "Admin",
          business_name: "Vasavi Events",
          role: "admin",
        });
      }

      return {
        success: true,
        message: "Admin account successfully created and confirmed! Logging you in...",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating admin";
      return { success: false, message: msg };
    }
  }

  return {
    success: false,
    message: "Service role key not configured. Please add admin user in Supabase Auth dashboard.",
  };
}
