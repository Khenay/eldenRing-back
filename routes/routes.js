const router = require("express").Router();

const user = require("../controllers/user.controllers");
const passRecovery = require("../controllers/recovery.controllers");


// router.get("/",user.home)
router.post("/login", user.login);
router.post("/listaClases",user.listaClases);
router.post("/register",user.register);
router.post("/weapon",user.weapon);
router.post("/legendaryWeapon",user.legendaryWeapon);
router.post("/profileWeapon",user.profileWeapon);
router.post("/profileWeaponL",user.profileWeaponL);
router.post("/allWeapons",user.allWeapons);
router.post("/change",user.change);
router.post("/contact",user.contact);

router.post("/recovery", passRecovery.confirmedUser);
router.get("/recoveryReset/:email/:token", passRecovery.confirmUserGet);
router.post("/recoveryReset/:email/:token", passRecovery.checkUserPost);


// router.get("/profile",user.profile);
// router.post("/login", user.login)
// router.get("/confirmuser/:id/:token", user.confirmUserGet);
// router.post("/confirmuser/:id/:token", user.checkUserPost);
// router.get("/datauser", user.dataUser);

module.exports = router;

