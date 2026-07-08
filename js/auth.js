/* ===================================
   GLITCHBOX AUTH SYSTEM
=================================== */

const Auth = {

    currentUser: null,

    async signUp(username, email, password){

        console.log("Creating account...");

        // Real database code will go here later

        return {
            success: true
        };

    },

    async login(email, password){

        console.log("Logging in...");

        // Real login will go here later

        return {
            success: true
        };

    },

    async logout(){

        console.log("Logging out...");

        this.currentUser = null;

        window.location.href = "landing.html";

    }

};