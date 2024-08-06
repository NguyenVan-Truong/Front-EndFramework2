import { Router } from "express";

// import { callblack, Payment, transaction } from "../controllers/momo.js";
import { Payment, transaction } from './../controllers/momo.js';


const PaymentRouter = Router();

PaymentRouter.post("/payment", Payment);
PaymentRouter.post("/check-status-transaction", transaction);

export default PaymentRouter;