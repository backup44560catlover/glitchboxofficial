/* =========================================
   GLITCHBOX SUPABASE CONNECTION
========================================= */

// Include this in your HTML before this file:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabase = window.supabase.createClient(
    GLITCHBOX.SUPABASE_URL,
    GLITCHBOX.SUPABASE_ANON_KEY
);

async function signUp(email, password, username){

    const { data, error } = await supabase.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {
                username: username,
                role: "Player"
            }

        }

    });

    return { data, error };

}

async function signIn(email, password){

    const { data, error } = await supabase.auth.signInWithPassword({

        email: email,

        password: password

    });

    return { data, error };

}

async function signOut(){

    await supabase.auth.signOut();

}