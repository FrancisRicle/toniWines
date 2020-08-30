const { Router } = require("express");
// import all routers;
const productPublicRouter = require("./public/product.js");
const productPrivateRouter = require("./private/product.js");
const categoryPublicRouter = require("./public/category.js");
const categoryPrivateRouter = require("./private/category.js");
const strainPublicRouter = require("./public/strain.js");
const strainPrivateRouter = require("./private/strain.js");
const cellarPublicRouter = require("./public/cellar.js");
const cellarPrivateRouter = require("./private/cellar.js");
const userRouter = require("./protected/user.js");
const userPrivateRouter = require("./private/user.js");
const purchaseProtectedRouter = require("./protected/purchase.js");
const purchasePrivateRouter = require("./private/purchase.js");
const purchProdProtectedRouter = require("./protected/purchProd.js");
const statusPrivateRouter = require("./private/status.js");
const authRouter = require("./auth.js").server;
const { isAuthenticated, isAdmin } = require("./auth.js");
const reviewRouter = require("./public/review.js");
const router = Router();
router.use("/auth", authRouter);
router.use("/product_public", productPublicRouter);
router.use("/product_private", isAuthenticated, isAdmin, productPrivateRouter);
router.use("/category_public", categoryPublicRouter);
router.use("/category_private", isAuthenticated, isAdmin, categoryPrivateRouter);
router.use("/strain_public", strainPublicRouter);
router.use("/strain_private", isAuthenticated, isAdmin, strainPrivateRouter);
router.use("/cellar_public", cellarPublicRouter);
router.use("/cellar_private", isAuthenticated, isAdmin, cellarPrivateRouter);
router.use("/user", isAuthenticated, userRouter);
router.use("/user_private", isAuthenticated, isAdmin, userPrivateRouter);
// ATENCIÓN, QUEDÓ SIN VERIFICAR AUTENTICACIÓN!!
router.use("/purchase_protected", purchaseProtectedRouter);
// ATENCIÓN, QUEDÓ SIN VERIFICAR AUTENTICACIÓN!!
router.use("/purchase_private", purchasePrivateRouter);
router.use("/purchased_products_protected", isAuthenticated, purchProdProtectedRouter); // ¿¿Se puede esto??
// ATENCIÓN, QUEDÓ SIN VERIFICAR AUTENTICACIÓN!!
router.use("/status_private", statusPrivateRouter);
router.use("/review", reviewRouter);
module.exports = router;
