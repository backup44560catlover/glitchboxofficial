/* ===================================
   GLITCHBOX V1 CORE
=================================== */

const GlitchBox = {

    version: "1.0",

    currentUser: null,

    role: "Player",

    roles: [
        "Player",
        "Moderator",
        "Admin",
        "Owner",
        "Founder"
    ]

};

/* ---------- Notifications ---------- */

function notify(message){

    alert(message);

}

/* ---------- Navigation ---------- */

function go(page){

    window.location.href = page;

}

/* ---------- Login ---------- */

function login(username, role="Player"){

    GlitchBox.currentUser = username;

    GlitchBox.role = role;

    console.log("Logged in:", username);

}

/* ---------- Logout ---------- */

function logout(){

    GlitchBox.currentUser = null;

    GlitchBox.role = "Player";

    window.location.href = "login.html";

}

/* ---------- Staff Check ---------- */

function hasRole(requiredRole){

    const order = {
        Player:0,
        Moderator:1,
        Admin:2,
        Owner:3,
        Founder:4
    };

    return order[GlitchBox.role] >= order[requiredRole];

}

/* ---------- Control Center ---------- */

function openControlCenter(){

    if(hasRole("Moderator")){

        window.location.href = "owner.html";

    }else{

        notify("Access Denied");

    }

}

/* ---------- Theme ---------- */

function initialize(){

    console.log("GlitchBox v1 Loaded");

}

window.onload = initialize;