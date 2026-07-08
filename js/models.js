/* ===================================
   GLITCHBOX DATA MODELS
=================================== */

const DefaultPlayer = {

    id: "",

    username: "",

    email: "",

    role: "Player",

    level: 1,

    xp: 0,

    coins: 0,

    gems: 0,

    inventory: [],

    friends: [],

    clan: null,

    achievements: [],

    badges: [],

    pets: [],

    theme: "Purple",

    device: "",

    createdAt: "",

    lastLogin: ""

};

const Roles = {

    PLAYER: "Player",

    MODERATOR: "Moderator",

    ADMIN: "Admin",

    OWNER: "Owner",

    FOUNDER: "Founder"

};

function isStaff(role){

    return role === Roles.MODERATOR ||
           role === Roles.ADMIN ||
           role === Roles.OWNER ||
           role === Roles.FOUNDER;

}

function isFounder(role){

    return role === Roles.FOUNDER;

}